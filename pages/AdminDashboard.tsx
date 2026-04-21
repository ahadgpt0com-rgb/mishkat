
import React, { useEffect, useState } from 'react';
import { getWebsiteConfig, saveWebsiteConfig } from '../services/storage';
import { uploadImage } from '../services/api';
import { WebsiteConfig, EventItem } from '../types';
import { 
    Save, Upload, Loader2, Trash2, Edit3, Image as ImageIcon, 
    Plus, LayoutTemplate, Clock, BookOpen, Calendar, Phone, MapPin, Lock 
} from 'lucide-react';

// --- Reusable Sub-components ---
const ProgressOverlay = ({ percent }: { percent: number }) => (
  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white rounded z-20">
    <Loader2 className="animate-spin mb-2" size={24} />
    <span className="text-xs font-bold">{percent}%</span>
  </div>
);

const TabButton = ({ id, activeTab, setActiveTab, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
          activeTab === id 
          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
          : 'bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const InputGroup = ({ label, value, onChange, type = "text" }: any) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
        <input 
          type={type} 
          value={value} 
          onChange={onChange} 
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all" 
        />
    </div>
);

const AdminDashboard: React.FC = () => {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configData = await getWebsiteConfig();
        setConfig(configData);
      } catch (err) {
        console.error("Config fetch error", err);
      }
    };
    fetchData();
  }, []);

  // --- Handlers ---

  const handleFieldChange = (section: keyof WebsiteConfig, field: string, value: any) => {
    if (!config) return;
    setConfig(prev => prev ? ({
        ...prev,
        [section]: { ...(prev[section] as any), [field]: value }
    }) : null);
  };

  const handleArrayItemChange = (section: 'stories' | 'events', index: number, field: string, value: any) => {
    if (!config) return;
    setConfig(prev => {
        if (!prev) return null;
        const newArray = [...prev[section]] as any[];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
    });
  };

  const addArrayItem = (section: 'stories' | 'events') => {
      if (!config) return;
      setConfig(prev => {
          if (!prev) return null;
          let newItem;
          if (section === 'stories') {
              newItem = { year: new Date().getFullYear().toString(), title: 'নতুন গল্প', description: '', image: '' };
          } else {
              newItem = { id: Date.now(), title: 'নতুন অনুষ্ঠান', date: '', time: '', location: '', description: '', icon: 'ring' };
          }
          return { ...prev, [section]: [...prev[section], newItem] };
      });
  };

  const removeArrayItem = (section: 'stories' | 'events', index: number) => {
      if (!config) return;
      if (!window.confirm('Are you sure you want to remove this item?')) return;
      setConfig(prev => {
          if (!prev) return null;
          const newArray = [...prev[section]];
          newArray.splice(index, 1);
          return { ...prev, [section]: newArray };
      });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const key = `${section}-${index ?? 'main'}`;
    setUploadProgress(prev => ({ ...prev, [key]: 10 }));

    try {
      const response = await uploadImage(file, (percent) => {
        setUploadProgress(prev => ({ ...prev, [key]: percent }));
      });

      if (response.success && response.imageUrl) {
        const finalUrl = response.imageUrl; 
        
        setConfig(prev => {
            if (!prev) return null;
            if (section === 'gallery') {
                return { ...prev, gallery: [...prev.gallery, finalUrl] };
            } else if (section === 'hero') {
                return { ...prev, hero: { ...prev.hero, image: finalUrl } };
            } else if (section === 'stories' && typeof index === 'number') {
                const newStories = [...prev.stories];
                newStories[index] = { ...newStories[index], image: finalUrl };
                return { ...prev, stories: newStories };
            }
            return prev;
        });
      } else {
        alert(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error", error);
      alert(error.message);
    } finally {
      setTimeout(() => {
        setUploadProgress(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }, 1000);
    }
  };

  const removeGalleryImage = (index: number) => {
    setConfig(prev => {
        if(!prev) return null;
        const newGallery = prev.gallery.filter((_, i) => i !== index);
        return { ...prev, gallery: newGallery };
    });
  };

  const saveContent = async () => {
    if (!config) return;
    setSaving(true);
    const success = await saveWebsiteConfig(config);
    setSaving(false);
    if (success) alert('Changes saved successfully!');
    else alert('Failed to save changes.');
  };

  if (!config) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={48} /></div>;

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header with Save */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-30">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Website Editor</h1>
           <p className="text-slate-500 text-sm">Customize the look and feel of your wedding site</p>
        </div>
        <button 
          onClick={saveContent} 
          disabled={saving} 
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 font-bold"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3">
          <TabButton id="hero" activeTab={activeTab} setActiveTab={setActiveTab} label="Hero & Intro" icon={LayoutTemplate} />
          <TabButton id="story" activeTab={activeTab} setActiveTab={setActiveTab} label="Our Story" icon={BookOpen} />
          <TabButton id="events" activeTab={activeTab} setActiveTab={setActiveTab} label="Events" icon={Calendar} />
          <TabButton id="gallery" activeTab={activeTab} setActiveTab={setActiveTab} label="Gallery" icon={ImageIcon} />
          <TabButton id="contact" activeTab={activeTab} setActiveTab={setActiveTab} label="Contact Info" icon={Phone} />
          <TabButton id="security" activeTab={activeTab} setActiveTab={setActiveTab} label="Security" icon={Lock} />
      </div>

      {/* --- Tab Contents --- */}
      
      {/* HERO SECTION */}
      {activeTab === 'hero' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <LayoutTemplate className="text-rose-500" /> Hero Section Configuration
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Groom's Name" value={config.hero.groomName} onChange={(e:any) => handleFieldChange('hero', 'groomName', e.target.value)} />
                        <InputGroup label="Bride's Name" value={config.hero.brideName} onChange={(e:any) => handleFieldChange('hero', 'brideName', e.target.value)} />
                    </div>
                    <InputGroup label="Wedding Date (Display)" value={config.hero.date} onChange={(e:any) => handleFieldChange('hero', 'date', e.target.value)} />
                    <InputGroup label="Countdown Target (ISO Format)" type="datetime-local" value={config.countdownDate} onChange={(e:any) => setConfig({...config, countdownDate: e.target.value})} />
                    <InputGroup label="Location Label" value={config.hero.location} onChange={(e:any) => handleFieldChange('hero', 'location', e.target.value)} />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cover Media (Image/Video)</label>
                    <div className="relative h-64 w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden flex flex-col items-center justify-center group hover:border-rose-400 transition-colors">
                        {config.hero.image ? (
                        config.hero.image.match(/\.(mp4|mkv|webm)$/i) ? (
                            <video src={config.hero.image} className="h-full w-full object-cover" muted autoPlay loop />
                        ) : (
                            <img src={config.hero.image} alt="Hero" className="h-full w-full object-cover" />
                        )
                        ) : (
                        <div className="text-center p-4 text-slate-400">
                            <ImageIcon className="mx-auto mb-2" size={32} />
                            <p className="text-sm">No media selected</p>
                        </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'hero')} />
                                Change Media
                            </label>
                        </div>
                        {uploadProgress['hero-main'] !== undefined && <ProgressOverlay percent={uploadProgress['hero-main']} />}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">Supported: JPG, PNG. (Images automatically compressed)</p>
                </div>
            </div>
          </div>
      )}

      {/* STORY SECTION */}
      {activeTab === 'story' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="text-rose-500" /> Love Story Timeline
                 </h3>
                 <button onClick={() => addArrayItem('stories')} className="flex items-center gap-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors">
                     <Plus size={16} /> Add Story Milestone
                 </button>
              </div>

              <div className="space-y-6">
                  {config.stories.map((story, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 relative group">
                          <button onClick={() => removeArrayItem('stories', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1">
                              <Trash2 size={18} />
                          </button>

                          <div className="w-full md:w-48 flex-shrink-0">
                             <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                                 <img src={story.image} className="w-full h-full object-cover" alt="" />
                                 <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                     <Upload className="text-white" size={24} />
                                     <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'stories', index)} />
                                 </label>
                                 {uploadProgress[`stories-${index}`] !== undefined && <ProgressOverlay percent={uploadProgress[`stories-${index}`]} />}
                             </div>
                          </div>

                          <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-3 gap-4">
                                  <div className="col-span-1">
                                    <InputGroup label="Year" value={story.year} onChange={(e:any) => handleArrayItemChange('stories', index, 'year', e.target.value)} />
                                  </div>
                                  <div className="col-span-2">
                                    <InputGroup label="Title" value={story.title} onChange={(e:any) => handleArrayItemChange('stories', index, 'title', e.target.value)} />
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                                  <textarea 
                                    rows={3} 
                                    value={story.description} 
                                    onChange={(e) => handleArrayItemChange('stories', index, 'description', e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                                  ></textarea>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* EVENTS SECTION */}
      {activeTab === 'events' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="text-rose-500" /> Event Schedule
                 </h3>
                 <button onClick={() => addArrayItem('events')} className="flex items-center gap-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors">
                     <Plus size={16} /> Add Event
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {config.events.map((event, index) => (
                      <div key={event.id} className="p-6 bg-slate-50 rounded-xl border border-slate-200 relative">
                          <button onClick={() => removeArrayItem('events', index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                          </button>
                          
                          <div className="space-y-4">
                              <InputGroup label="Event Title" value={event.title} onChange={(e:any) => handleArrayItemChange('events', index, 'title', e.target.value)} />
                              <div className="grid grid-cols-2 gap-4">
                                  <InputGroup label="Date" value={event.date} onChange={(e:any) => handleArrayItemChange('events', index, 'date', e.target.value)} />
                                  <InputGroup label="Time" value={event.time} onChange={(e:any) => handleArrayItemChange('events', index, 'time', e.target.value)} />
                              </div>
                              <InputGroup label="Location" value={event.location} onChange={(e:any) => handleArrayItemChange('events', index, 'location', e.target.value)} />
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                                  <textarea 
                                    rows={2} 
                                    value={event.description} 
                                    onChange={(e) => handleArrayItemChange('events', index, 'description', e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                                  ></textarea>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Icon Type</label>
                                  <select 
                                    value={event.icon} 
                                    onChange={(e) => handleArrayItemChange('events', index, 'icon', e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 outline-none"
                                  >
                                      <option value="ring">Ring/Ceremony</option>
                                      <option value="music">Music/Party</option>
                                      <option value="camera">Camera/Reception</option>
                                      <option value="utensils">Food/Dinner</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* GALLERY SECTION */}
      {activeTab === 'gallery' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ImageIcon className="text-rose-500" /> Photo & Video Gallery
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {config.gallery.map((src, idx) => (
                <div key={idx} className="relative group aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                {src.match(/\.(mp4|mkv|webm)$/i) ? (
                    <video src={src} className="w-full h-full object-cover" />
                ) : (
                    <img src={src} alt="gallery" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => removeGalleryImage(idx)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg">
                    <Trash2 size={20} />
                    </button>
                </div>
                </div>
            ))}
            
            <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center hover:bg-rose-50 hover:border-rose-300 transition-all aspect-square relative overflow-hidden group">
                {uploadProgress['gallery-main'] !== undefined ? (
                    <div className="flex flex-col items-center p-4 text-center">
                        <Loader2 className="animate-spin text-rose-500 mb-2" />
                        <span className="text-xs font-bold text-slate-600">{uploadProgress['gallery-main']}%</span>
                    </div>
                ) : (
                    <>
                    <div className="p-3 bg-slate-100 rounded-full mb-2 group-hover:bg-white transition-colors">
                        <Upload className="text-slate-400 group-hover:text-rose-500" size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Upload</span>
                    </>
                )}
                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery')} />
            </label>
            </div>
          </div>
      )}

      {/* CONTACT SECTION */}
      {activeTab === 'contact' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in max-w-3xl">
             <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Phone className="text-rose-500" /> Contact Information
             </h3>
             <div className="space-y-5">
                 <InputGroup label="Phone Number" value={config.contact.phone} onChange={(e:any) => handleFieldChange('contact', 'phone', e.target.value)} />
                 <InputGroup label="Email Address" value={config.contact.email} onChange={(e:any) => handleFieldChange('contact', 'email', e.target.value)} />
                 <InputGroup label="Display Address" value={config.contact.address} onChange={(e:any) => handleFieldChange('contact', 'address', e.target.value)} />
                 
                 <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><MapPin size={16} /> Map Coordinates</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Latitude" value={config.contact.latitude || ''} onChange={(e:any) => handleFieldChange('contact', 'latitude', e.target.value)} />
                        <InputGroup label="Longitude" value={config.contact.longitude || ''} onChange={(e:any) => handleFieldChange('contact', 'longitude', e.target.value)} />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">These coordinates are used to generate the Google Maps link.</p>
                 </div>
             </div>
          </div>
      )}

     {/* SECURITY SECTION */}
      {activeTab === 'security' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in max-w-3xl">
             <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Lock className="text-rose-500" /> Security
             </h3>
             <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Guest Access PIN</h4>
                    <p className="text-sm text-slate-500 mb-4">
                      This is the 4-digit code guests enter to view your website. 
                      Change this to lock out previous guests until they enter the new PIN.
                    </p>
                    <div className="max-w-xs">
                        <InputGroup 
                          label="4-Digit PIN Code" 
                          value={config.pinCode || '1234'} 
                          type="text"
                          onChange={(e:any) => {
                             // Only allow exactly 4 digits
                             const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                             setConfig({...config, pinCode: val});
                          }} 
                        />
                    </div>
                 </div>
                 
                 <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                     Looking to change your Admin Console password? You can find that option in the <b>Settings</b> menu in the sidebar.
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
