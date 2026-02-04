import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Award, Users, Heart, Shield } from 'lucide-react';
import doctorInteraction from '../assets/doctor-interaction.png';

const About = () => {
    const { theme } = useTheme();

    const Feature = ({ icon: Icon, title, desc }) => (
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-500">{desc}</p>
        </div>
    );

    return (
        <div className="min-h-screen pt-20 pb-12 animate-fade-in">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)' }}></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Revolutionizing Healthcare Management</h1>
                    <p className="text-xl text-gray-300">
                        We are dedicated to providing a seamless, intelligent, and patient-centric appointment experience.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6" style={{ color: theme.primaryColor }}>Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            At {theme.hospitalName}, our mission is to bridge the gap between patients and healthcare providers through technology.
                            We believe that accessing quality healthcare should be simple, transparent, and stress-free.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            By leveraging intelligent scheduling and real-time availability, we reduce wait times and ensure that doctors can focus on what matters most—patient care.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img src={doctorInteraction} alt="Doctor" className="rounded-xl shadow-lg w-full h-48 object-cover transform translate-y-4" />
                        <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Hospital" className="rounded-xl shadow-lg w-full h-48 object-cover transform -translate-y-4" />
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
                        <p className="text-gray-600">Our core values drive everything we do.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Feature icon={Heart} title="Patient First" desc="We prioritize the needs and comfort of every patient above all else." />
                        <Feature icon={Shield} title="Secure & Private" desc="Your health data is protected with state-of-the-art security measures." />
                        <Feature icon={Users} title="Top Specialists" desc="Access a network of highly qualified and experienced doctors." />
                        <Feature icon={Award} title="Excellence" desc="We are committed to delivering the highest standard of healthcare services." />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
