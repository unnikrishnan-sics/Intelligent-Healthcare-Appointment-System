import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Check, Layout } from 'lucide-react';

const ThemeSettings = () => {
    const { theme, updateTheme } = useTheme();
    const [localTheme, setLocalTheme] = useState(theme);
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalTheme(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        updateTheme(localTheme);
        // Here you would also API call to save to backend
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Palette className="text-gray-600" /> Theme Customization
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Branding Section */}
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Branding</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                            <input
                                type="text"
                                name="hospitalName"
                                value={localTheme.hospitalName}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none"
                                style={{ '--tw-ring-color': localTheme.primaryColor }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Optional)</label>
                            <input
                                type="text"
                                name="logoUrl"
                                value={localTheme.logoUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Colors Section */}
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Colors</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    name="primaryColor"
                                    value={localTheme.primaryColor}
                                    onChange={handleChange}
                                    className="h-8 w-14 rounded cursor-pointer"
                                />
                                <span className="text-xs text-gray-500 font-mono">{localTheme.primaryColor}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    name="secondaryColor"
                                    value={localTheme.secondaryColor}
                                    onChange={handleChange}
                                    className="h-8 w-14 rounded cursor-pointer"
                                />
                                <span className="text-xs text-gray-500 font-mono">{localTheme.secondaryColor}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">Accent Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    name="accentColor"
                                    value={localTheme.accentColor}
                                    onChange={handleChange}
                                    className="h-8 w-14 rounded cursor-pointer"
                                />
                                <span className="text-xs text-gray-500 font-mono">{localTheme.accentColor}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white p-6 rounded-xl shadow border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Layout size={18} /> Live Preview
                </h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="mb-2">This is how your buttons and accents will look:</p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 text-white rounded-lg font-medium shadow-sm transition"
                            style={{ backgroundColor: localTheme.primaryColor }}>
                            Primary Action
                        </button>
                        <button className="px-4 py-2 text-white rounded-lg font-medium shadow-sm transition"
                            style={{ backgroundColor: localTheme.secondaryColor }}>
                            Secondary Action
                        </button>
                        <button className="px-4 py-2 text-white rounded-lg font-bold shadow-sm transition"
                            style={{ backgroundColor: localTheme.accentColor }}>
                            Accent / Call to Action
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: theme.primaryColor }}
                >
                    {saved ? <Check /> : 'Save Changes'}
                    {saved ? 'Saved!' : ''}
                </button>
            </div>
        </div>
    );
};

export default ThemeSettings;
