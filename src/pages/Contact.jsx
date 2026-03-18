import { useState } from 'react';
import contactService from '../api/services/contactService';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await contactService.send(formData);
            setSuccess("Message sent successfully!");
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="mt-30 bg-slate-900 py-20 px-6 text-center text-white">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-amber-500 mb-4">Get in Touch</h3>
                <h2 className="text-3xl font-serif mb-10">Your personal concierge awaits.</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">

                    {error && (
                        <div className="md:col-span-2 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded text-xs">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="md:col-span-2 bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded text-xs">
                            {success}
                        </div>
                    )}

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="NAME"
                        required
                        className="bg-transparent border-b border-white/20 py-4 px-2 text-xs tracking-widest focus:border-amber-500 outline-none transition-colors"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="EMAIL"
                        required
                        className="bg-transparent border-b border-white/20 py-4 px-2 text-xs tracking-widest focus:border-amber-500 outline-none transition-colors"
                    />

                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="MESSAGE"
                        rows={5}
                        required
                        className="md:col-span-2 bg-transparent border-b border-white/20 py-4 px-2 text-xs tracking-widest focus:border-amber-500 outline-none transition-colors resize-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="md:col-span-2 mt-6 border border-amber-500 text-amber-500 py-4 uppercase text-[10px] tracking-[0.4em] font-bold hover:bg-amber-500 hover:text-slate-900 transition-all disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Inquiry"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;