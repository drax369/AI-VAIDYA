import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Enter name and email");
      return;
    }

    const user = {
      name,
      email,
      joinedAt: new Date().toISOString(),
    };

    localStorage.setItem("aiVaidyaUser", JSON.stringify(user));
    onLogin(user);
  }

  return (
    <div className="min-h-screen bg-[#020d09] text-[#f5e6c8] relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,168,79,0.18),transparent_45%)]" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/10 blur-[170px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-500/10 blur-[170px] rounded-full" />

      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-[36px] border border-yellow-500/20 bg-black/35 backdrop-blur-xl p-8 shadow-[0_0_70px_rgba(214,168,79,0.2)]"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-green-500 flex items-center justify-center shadow-[0_0_35px_rgba(214,168,79,0.5)]">
            <Leaf className="text-black" size={32} />
          </div>
        </div>

        <h1 className="text-4xl font-black text-yellow-400 text-center mb-2">
          Welcome to AI VAIDYA
        </h1>

        <p className="text-yellow-50/60 text-center mb-8">
          Create your wellness workspace profile.
        </p>

        <div className="space-y-4">
          <div className="rounded-2xl border border-yellow-500/20 bg-black/40 px-4 py-3 flex items-center gap-3">
            <Sparkles className="text-yellow-400" size={20} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-transparent outline-none w-full text-yellow-50 placeholder:text-yellow-50/30"
            />
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-black/40 px-4 py-3 flex items-center gap-3">
            <Mail className="text-yellow-400" size={20} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              className="bg-transparent outline-none w-full text-yellow-50 placeholder:text-yellow-50/30"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-green-500 text-black font-black text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          Enter Workspace
          <ArrowRight />
        </button>

        <div className="mt-6 flex items-center gap-2 text-xs text-yellow-50/40 justify-center">
          <Lock size={14} />
          Demo login stores profile locally in browser.
        </div>
      </motion.form>
    </div>
  );
}

export default LoginPage;