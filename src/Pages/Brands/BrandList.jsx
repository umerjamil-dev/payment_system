import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Globe, Palette, Upload, Image as ImageIcon } from 'lucide-react';
import { useCRM } from '../../Context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';

const BrandList = () => {
    const { brands, addBrand, updateBrand, deleteBrand } = useCRM();
    const [isAdding, setIsAdding] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({ name: '', color: '#CA1D2A', logo: '', description: '' });
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, logo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBrand) {
            updateBrand(editingBrand.id, formData);
            setEditingBrand(null);
        } else {
            addBrand(formData);
        }
        setFormData({ name: '', color: '#CA1D2A', logo: '', description: '' });
        setIsAdding(false);
    };

    const handleEdit = (brand) => {
        setEditingBrand(brand);
        setFormData({ name: brand.name, color: brand.color, logo: brand.logo || '', description: brand.description || '' });
        setIsAdding(true);
    };

    return (
        <div className="space-y-6 text-black">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Brand Management</h2>
                <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Brand
                </Button>
            </div>

            {isAdding && (
                <Card className="animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Brand Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Nexus Premium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Primary Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            className="h-10 w-20 p-1 rounded border"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 p-2 border rounded-lg uppercase"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Brand Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-primary/50 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {formData.logo ? (
                                                <img src={formData.logo} alt="Preview" className="w-full h-full object-contain" />
                                            ) : (
                                                <Upload className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center gap-2"
                                            >
                                                <ImageIcon className="w-4 h-4" />
                                                Choose from PC
                                            </Button>
                                            <p className="text-[10px] text-gray-400 mt-1">Recommended: Square image, max 2MB</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        className="w-full p-2 border rounded-lg h-24 resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the brand..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => { setIsAdding(false); setEditingBrand(null); }}>Cancel</Button>
                                <Button type="submit">{editingBrand ? 'Update' : 'Save'} Brand</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand) => (
                    <Card key={brand.id} className="group hover:border-primary/50 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                    style={{ backgroundColor: brand.color }}
                                >
                                    {brand.logo ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain rounded-xl" /> : brand.name.charAt(0)}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(brand)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteBrand(brand.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{brand.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{brand.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Palette className="w-4 h-4" />
                                <span className="uppercase font-mono">{brand.color}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BrandList;
