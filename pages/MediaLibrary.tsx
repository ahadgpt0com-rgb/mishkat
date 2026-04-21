
import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Trash2, Copy, Upload, Film, Image as ImageIcon, Check, Loader2, X, RefreshCw, AlertTriangle } from 'lucide-react';

interface MediaFile {
    name: string;
    url: string;
    type: 'image' | 'video';
    size: number;
    createdAt: string;
}

const MediaLibrary: React.FC = () => {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchMedia = async () => {
        setError(null);
        try {
            const data = await adminApi.getMedia();
            setMedia(data);
        } catch (error: any) {
            console.error("Failed to load media", error);
            setError(error.message || "Failed to load media files. Ensure backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            await adminApi.uploadFile(file, (p) => setProgress(p));
            await fetchMedia(); // Refresh list
        } catch (error: any) {
            alert('Upload failed: ' + (error?.message || "Unknown error"));
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleDelete = async (filename: string) => {
        if (!window.confirm('Are you sure you want to delete this file? This might break pages using this file.')) return;

        try {
            await adminApi.deleteMedia(filename);
            setMedia(prev => prev.filter(m => m.name !== filename));
        } catch (error) {
            alert('Failed to delete file');
        }
    };

    const copyToClipboard = (url: string, name: string) => {
        const fullUrl = `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(name);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-rose-500" size={48} />
        </div>
    );

    if (error) return (
         <div className="flex h-96 flex-col items-center justify-center text-center p-6 bg-red-50 rounded-2xl border border-red-100">
            <AlertTriangle className="text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-bold text-red-700">Unable to Connect</h3>
            <p className="text-red-600 mt-2 mb-6 max-w-md">{error}</p>
            <button 
                onClick={() => { setLoading(true); fetchMedia(); }}
                className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition-colors"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage all your uploaded images and videos</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { setLoading(true); fetchMedia(); }}
                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <label className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium cursor-pointer transition-all shadow-lg shadow-rose-500/20
                        ${uploading ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'}
                    `}>
                        {uploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>{progress}%</span>
                            </>
                        ) : (
                            <>
                                <Upload size={18} />
                                <span>Upload New</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            className="hidden" 
                            onChange={handleUpload} 
                            disabled={uploading}
                            accept="image/*,video/*"
                        />
                    </label>
                </div>
            </div>

            {media.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No media files yet</h3>
                    <p className="text-slate-500 mt-1 mb-6">Upload your first image or video to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {media.map((file) => (
                        <div key={file.name} className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="relative aspect-square bg-slate-100 overflow-hidden">
                                {file.type === 'video' ? (
                                    <video src={file.url} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                                )}
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button 
                                        onClick={() => copyToClipboard(file.url, file.name)}
                                        className="p-2 bg-white rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                                        title="Copy Link"
                                    >
                                        {copiedId === file.name ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(file.name)}
                                        className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-xs text-white flex items-center gap-1">
                                    {file.type === 'video' ? <Film size={12} /> : <ImageIcon size={12} />}
                                    <span className="uppercase">{file.name.split('.').pop()}</span>
                                </div>
                            </div>
                            
                            <div className="p-3">
                                <p className="text-sm font-medium text-slate-700 truncate" title={file.name}>{file.name}</p>
                                <p className="text-xs text-slate-400 mt-1">{formatSize(file.size)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaLibrary;
