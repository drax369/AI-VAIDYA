import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls, Stars } from "@react-three/drei";
import HistoryPanel from "./HistoryPanel";
import { getHistory, saveHistory } from "./history";
import DemoMode from "./DemoMode";
import {
  BrainCircuit,
  Leaf,
  Activity,
  ScanLine,
  Sparkles,
  Upload,
  MessageSquare,
  ShieldAlert,
  Mic,
  MicOff,
  Volume2,
  Square,
  ArrowRight,
  Mail,
  Lock,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  askRag,
  analyzeHybridVision,
  getPrakritiQuestions,
  analyzePrakriti,
  generateDinacharya,
  recommendRecipe,
} from "./api";

function App() {
  const [booting, setBooting] = useState(true);
  const [entered, setEntered] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("aiVaidyaUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1700);
    return () => clearTimeout(timer);
  }, []);

  if (booting) return <LoadingPage />;
  if (!entered) return <LandingPage onEnter={() => setEntered(true)} />;
  if (!user) return <LoginPage onLogin={setUser} />;

  return <Workspace user={user} setUser={setUser} />;
}

function PageBg({ soft = false, workspace = false }) {
  return (
    <>
      <div
        className={`absolute inset-0 bg-[url('/images/herbs-bg.jpg')] bg-cover bg-center ${
          workspace ? "opacity-[0.30]" : "opacity-[0.55]"
        }`}
      />

      <div
        className={`absolute inset-0 ${
          workspace
            ? "bg-gradient-to-br from-[#edf3e8]/78 via-[#eef6e9]/72 to-[#1f4d35]/35"
            : soft
            ? "bg-gradient-to-br from-[#edf3e8]/70 via-[#e5f0dc]/60 to-[#8daa7b]/45"
            : "bg-gradient-to-br from-[#edf3e8]/62 via-[#dfead6]/50 to-[#1f4d35]/32"
        }`}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.03),transparent_48%)]" />
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-[#8daa7b]/4 blur-[90px] rounded-full" />
      <div className="absolute bottom-[-160px] right-[-120px] w-[420px] h-[420px] bg-[#1f4d35]/3 blur-[90px] rounded-full" />
    </>
  );
}

function LoadingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#edf3e8] text-[#1f2e24] flex items-center justify-center">
      <PageBg soft />
      <FloatingLeaves />
      <div className="absolute inset-0 pointer-events-none opacity-80">
        <Canvas camera={{ position: [0, 0, 6], fov: 52 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.85} />
            <pointLight position={[4, 5, 5]} intensity={2} />
            <Environment preset="forest" />
            <LoadingOrb />
          </Suspense>
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 text-center bg-white/80 backdrop-blur-xl border border-[#8daa7b]/40 rounded-[36px] p-10 shadow-2xl"
      >
        <div className="mx-auto mb-5 w-16 h-16 rounded-3xl bg-gradient-to-br from-[#8daa7b] to-[#1f4d35] flex items-center justify-center shadow-xl">
          <Leaf className="text-white" size={34} />
        </div>

        <h1 className="text-5xl font-black text-[#123425] mb-3">
          AI VAIDYA
        </h1>

        <p className="text-[#1f2e24]/70 mb-6">
          Initializing Ayurveda Intelligence...
        </p>

        <div className="w-[280px] h-3 rounded-full bg-[#dbead4] overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.1 }}
            className="h-full w-1/2 bg-gradient-to-r from-[#1f4d35] to-[#8daa7b]"
          />
        </div>
      </motion.div>
    </div>
  );
}

function FloatingLeaves() {
  const leaves = Array.from({ length: 22 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {leaves.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[#1f4d35]/30 text-3xl"
          style={{
            left: `${(i * 17) % 100}%`,
            bottom: "-80px",
          }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "-115vh",
            rotate: 360,
            opacity: [0, 0.6, 0.25, 0],
          }}
          transition={{
            duration: 16 + i,
            repeat: Infinity,
            delay: i * 0.9,
            ease: "linear",
          }}
        >
          ❧
        </motion.div>
      ))}
    </div>
  );
}

function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#edf3e8] text-[#1f2e24]">
      <PageBg />
      <FloatingLeaves />

      <div className="absolute inset-y-0 left-[50%] w-[30%] pointer-events-none opacity-95">
        <Canvas camera={{ position: [0, 0, 7.2], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.85} />
            <pointLight position={[5, 5, 5]} intensity={2} />
            <Stars radius={90} depth={50} count={900} factor={3} fade speed={0.8} />
            <Environment preset="forest" />
            <AyurvedaCore />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.7}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="flex items-center justify-between px-7 lg:px-16 py-6">
          <FadeIn>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8daa7b] to-[#1f4d35] flex items-center justify-center shadow-xl">
                <Leaf className="text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-[#1f4d35]">
                  AI VAIDYA
                </h1>
                <p className="text-xs text-[#1f2e24]/75">
                  Ayurveda Intelligence System
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <button
              onClick={onEnter}
              className="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#2f6b45] text-white font-bold hover:scale-105 transition-all shadow-lg"
            >
              Launch Workspace
              <ArrowRight size={18} />
            </button>
          </FadeIn>
        </nav>

        <main className="flex-1 grid lg:grid-cols-[0.92fr_1.08fr] items-center gap-10 px-7 lg:px-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#1f4d35]/20 bg-white/85 text-[#1f4d35] shadow-md backdrop-blur">
              <Sparkles size={16} />
              Ayurveda RAG • Vision AI • Voice • Multilingual
            </div>

            <h2 className="text-5xl lg:text-7xl font-black leading-[0.98] text-[#123425] mb-6 tracking-tight">
              Ancient
              <br />
              Ayurveda.
              <br />
              Modern Care.
            </h2>

            <p className="text-lg lg:text-xl text-[#1f2e24]/90 leading-relaxed max-w-2xl mb-6">
              AI VAIDYA combines Ayurveda knowledge retrieval, Prakriti analysis,
              herb detection, skin and tongue wellness scanning, voice interaction,
              and multilingual guidance in one natural wellness platform.
            </p>

            <motion.img
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              src="/images/tulsi.jpg"
              alt="Ayurvedic herbs"
              className="mb-8 w-full max-w-xl h-[250px] object-cover rounded-[32px] shadow-2xl border border-[#8daa7b]/45"
            />

            <button
              onClick={onEnter}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2f6b45] to-[#8daa7b] text-white font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Enter AI VAIDYA
              <ArrowRight />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.86, x: 40, y: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="hidden lg:flex justify-end items-end translate-x-24 translate-y-44"
          >
            <div className="ml-auto w-[360px] rounded-[28px] border border-transparent bg-transparent p-5">
              <div className="flex items-center gap-3 mb-4 text-[#1f4d35] font-bold text-sm">
                <ShieldAlert size={18} />
                AI VAIDYA Modules
              </div>

              <Feature title="Hybrid Ayurveda RAG" desc="Semantic + keyword retrieval with citations." />
              <Feature title="AyurVision Scanner" desc="Herb, skin, tongue and symptom image analysis." />
              <Feature title="Prakriti Analyzer" desc="Vata, Pitta and Kapha constitution engine." />
              <Feature title="Voice + Multilingual" desc="Speak and listen in Indian languages." />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

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
      name: name.trim(),
      email: email.trim(),
      joinedAt: new Date().toISOString(),
    };

    localStorage.setItem("aiVaidyaUser", JSON.stringify(user));
    onLogin(user);
  }

  return (
    <div className="min-h-screen bg-[#edf3e8] text-[#1f2e24] relative overflow-hidden flex items-center justify-center p-6">
      <PageBg soft />
      <FloatingLeaves />

      <div className="absolute inset-0 pointer-events-none opacity-45">
        <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.85} />
            <pointLight position={[5, 5, 5]} intensity={2} />
            <Environment preset="forest" />
            <MiniAyurvedaModel position={[2.5, 0, 0]} />
            <MiniAyurvedaModel position={[-2.5, 0, 0]} />
          </Suspense>
        </Canvas>
      </div>

      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65 }}
        className="relative z-10 w-full max-w-md rounded-[36px] border border-[#8daa7b]/40 bg-white/95 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#8daa7b] to-[#1f4d35] flex items-center justify-center shadow-xl">
            <Leaf className="text-white" size={32} />
          </div>
        </div>

        <h1 className="text-4xl font-black text-[#123425] text-center mb-2">
          Welcome to AI VAIDYA
        </h1>

        <p className="text-[#1f2e24]/70 text-center mb-8">
          Create your wellness workspace profile.
        </p>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#8daa7b]/40 bg-white px-4 py-3 flex items-center gap-3">
            <Sparkles className="text-[#2f6b45]" size={20} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-transparent outline-none w-full text-[#1f2e24] placeholder:text-[#1f2e24]/40"
            />
          </div>

          <div className="rounded-2xl border border-[#8daa7b]/40 bg-white px-4 py-3 flex items-center gap-3">
            <Mail className="text-[#2f6b45]" size={20} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              className="bg-transparent outline-none w-full text-[#1f2e24] placeholder:text-[#1f2e24]/40"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-[#2f6b45] to-[#8daa7b] text-white font-black text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          Enter Workspace
          <ArrowRight />
        </button>

        <div className="mt-6 flex items-center gap-2 text-xs text-[#1f2e24]/45 justify-center">
          <Lock size={14} />
          Demo login stores profile locally in browser.
        </div>
      </motion.form>
    </div>
  );
}

function LoadingOrb() {
  return (
    <Float speed={2.2} rotationIntensity={1.5} floatIntensity={1.2}>
      <mesh>
        <sphereGeometry args={[0.75, 64, 64]} />
        <meshStandardMaterial
          color="#1f4d35"
          emissive="#1f4d35"
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.25}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.035, 16, 140]} />
        <meshStandardMaterial color="#8daa7b" emissive="#8daa7b" emissiveIntensity={0.6} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.2, 0.025, 16, 120]} />
        <meshStandardMaterial color="#2f6b45" emissive="#2f6b45" emissiveIntensity={0.5} />
      </mesh>
    </Float>
  );
}

function MiniAyurvedaModel({ position = [0, 0, 0] }) {
  return (
    <group position={position} scale={0.6}>
      <LoadingOrb />
    </group>
  );
}

function AyurvedaCore() {
  return (
    <group position={[0, 0.15, 0]} scale={0.68}>
      <Float speed={2} rotationIntensity={1.15} floatIntensity={1.5}>
        <mesh>
          <torusGeometry args={[2.15, 0.035, 16, 160]} />
          <meshStandardMaterial color="#8daa7b" emissive="#8daa7b" emissiveIntensity={0.45} />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.025, 16, 140]} />
          <meshStandardMaterial color="#1f4d35" emissive="#1f4d35" emissiveIntensity={0.35} />
        </mesh>

        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.1, 0.02, 16, 120]} />
          <meshStandardMaterial color="#2f6b45" emissive="#2f6b45" emissiveIntensity={0.35} />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshStandardMaterial
            color="#1f4d35"
            emissive="#1f4d35"
            emissiveIntensity={0.28}
            roughness={0.3}
            metalness={0.25}
          />
        </mesh>

        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const x = Math.cos(angle) * 2.75;
          const y = Math.sin(angle) * 2.75;

          return (
            <mesh key={i} position={[x, y, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial color="#8daa7b" emissive="#8daa7b" emissiveIntensity={0.7} />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

function Feature({ title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="mb-3 rounded-2xl border border-[#8daa7b]/30 bg-[#f7fbf4] p-3 shadow-sm"
    >
      <h3 className="text-[#123425] font-bold mb-1 text-sm">{title}</h3>
      <p className="text-xs text-[#1f2e24]/65">{desc}</p>
    </motion.div>
  );
}

function Workspace({ user, setUser }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const [mode, setMode] = useState("skin");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [visionResult, setVisionResult] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [prakritiResult, setPrakritiResult] = useState(null);
  const [dinacharyaResult, setDinacharyaResult] = useState(null);
  const [recipeCondition, setRecipeCondition] = useState("cough");
  const [recipeResult, setRecipeResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [language, setLanguage] = useState("English");
  const [history, setHistory] = useState(() => getHistory());

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await getPrakritiQuestions();
        setQuestions(data.questions || []);
      } catch {
        console.log("Failed to load Prakriti questions");
      }
    }

    loadQuestions();
  }, []);

  function handleLogout() {
    localStorage.removeItem("aiVaidyaUser");
    setUser(null);
  }

  function startDemoFlow() {
    setLanguage("English");
    setQuery(
      "A user has mild cough and congestion. Explain useful Ayurvedic herbs like Tulsi and safe home guidance."
    );

    alert(
      "Demo flow started. Step 1: Click Ask AI VAIDYA. Step 2: Upload a skin/herb/tongue image in AyurVision. Step 3: Complete Prakriti quiz. Step 4: Generate Dinacharya and Recipe."
    );
  }

  function openHistoryItem(item) {
    if (item.type === "RAG Answer") {
      setQuery(item.query || "");
      setAnswer(item.answer || "");
      setSources(item.sources || []);
    }

    if (item.type === "Vision Analysis") {
      setVisionResult(item.data);
    }

    if (item.type === "Prakriti Report") {
      setPrakritiResult(item.data);
    }
  }

  async function handleAsk() {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setAnswer("");
      setSources([]);

      const data = await askRag(query, language);

      setAnswer(data.answer);
      setSources(data.sources || []);

      const saved = saveHistory({
        type: "RAG Answer",
        title: query,
        query,
        answer: data.answer,
        sources: data.sources || [],
      });

      setHistory((prev) => [saved, ...prev].slice(0, 30));
    } catch {
      setAnswer("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  }

  function getSpeechLang(language) {
    const map = {
      English: "en-IN",
      Hindi: "hi-IN",
      Kannada: "kn-IN",
      Tamil: "ta-IN",
      Telugu: "te-IN",
      Malayalam: "ml-IN",
      Bengali: "bn-IN",
      Marathi: "mr-IN",
      Gujarati: "gu-IN",
    };

    return map[language] || "en-IN";
  }

  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLang(language);
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => setQuery(event.results[0][0].transcript);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  }

  function speakText(text) {
    if (!text) return;

    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getSpeechLang(language);
    utterance.rate = 0.92;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setVisionResult(null);
  }

  async function handleVisionAnalyze() {
    if (!image) return;

    try {
      setLoading(true);
      setVisionResult(null);

      const data = await analyzeHybridVision(mode, image);
      setVisionResult(data);

      const saved = saveHistory({
        type: "Vision Analysis",
        title: `${mode} scan - ${data.clip_prediction?.label || "analysis"}`,
        data,
      });

      setHistory((prev) => [saved, ...prev].slice(0, 30));
    } catch {
      alert("Vision analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handlePrakritiAnalyze() {
    const selectedAnswers = Object.values(answers);

    if (selectedAnswers.length < questions.length) {
      alert("Please answer all Prakriti questions.");
      return;
    }

    try {
      setLoading(true);

      const data = await analyzePrakriti(selectedAnswers);

      setPrakritiResult(data);
      setDinacharyaResult(null);
      setRecipeResult(null);

      const saved = saveHistory({
        type: "Prakriti Report",
        title: data.prakriti_type,
        data,
      });

      setHistory((prev) => [saved, ...prev].slice(0, 30));
    } catch {
      alert("Prakriti analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDinacharyaGenerate() {
    if (!prakritiResult?.prakriti_type) return;

    try {
      setLoading(true);
      const data = await generateDinacharya(prakritiResult.prakriti_type);
      setDinacharyaResult(data);
    } catch {
      alert("Dinacharya generation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRecipeRecommend() {
    if (!prakritiResult?.prakriti_type) return;

    try {
      setLoading(true);

      const data = await recommendRecipe(
        prakritiResult.prakriti_type,
        recipeCondition
      );

      setRecipeResult(data);
    } catch {
      alert("Recipe recommendation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#edf3e8] text-[#1f2e24] overflow-hidden relative">
      <PageBg workspace />
      <FloatingLeaves />

      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Canvas camera={{ position: [0, 0, 8], fov: 55 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.75} />
            <pointLight position={[5, 5, 5]} intensity={1.8} />
            <Environment preset="forest" />
            <MiniAyurvedaModel position={[3.8, 1.8, 0]} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <aside className="w-full lg:w-[300px] border-r border-[#8daa7b]/30 bg-[#123425] backdrop-blur-xl p-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#edf3e8] to-[#8daa7b] flex items-center justify-center shadow-xl">
                <Leaf className="text-[#1f4d35]" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-wide text-white">
                  AI VAIDYA
                </h1>
                <p className="text-sm text-white/75">
                  Ayurveda Intelligence System
                </p>
                <p className="text-xs text-[#b7d2a5] mt-1">
                  Welcome, {user?.name}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 w-full py-3 rounded-2xl border border-white/15 bg-white/14 text-white flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>

          <div className="space-y-3">
            <SidebarCard icon={<MessageSquare size={18} />} title="AI Chat" desc="Hybrid Ayurveda RAG" />
            <SidebarCard icon={<ScanLine size={18} />} title="AyurVision" desc="Skin • Herb • Tongue" />
            <SidebarCard icon={<BrainCircuit size={18} />} title="Prakriti" desc="Dosha Intelligence" />
            <SidebarCard icon={<Sparkles size={18} />} title="Dinacharya" desc="Daily Routine Engine" />
            <SidebarCard icon={<Activity size={18} />} title="Recipes" desc="Ayurvedic Guidance" />
          </div>

          <div className="mt-10 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3 text-white font-bold">
              <ShieldAlert size={18} />
              Safety Notice
            </div>

            <p className="text-sm leading-relaxed text-white/75 mb-5">
              AI VAIDYA provides educational Ayurvedic wellness guidance. It is
              not a replacement for professional medical diagnosis.
            </p>

            <DemoMode onFillDemo={startDemoFlow} />

            <HistoryPanel
              history={history}
              setHistory={setHistory}
              onOpen={openHistoryItem}
            />
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-[1500px] mx-auto">
            <FadeIn>
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-[#123425] mb-3 leading-tight tracking-tight">
                      Ancient Ayurveda
                      <br />
                      Meets Modern AI
                    </h2>

                    <p className="text-[#1f2e24]/75 max-w-2xl text-lg leading-relaxed">
                      Hybrid RAG + Vision Intelligence + Ayurveda Knowledge +
                      Personalized Wellness Guidance.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 min-w-[320px]">
                    <StatCard value="Hybrid" label="RAG Engine" />
                    <StatCard value="CLIP" label="Vision AI" />
                    <StatCard value="Gemini" label="Reasoning" />
                    <StatCard value="Multi" label="Modal AI" />
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="mb-8 rounded-[32px] border border-[#8daa7b]/35 bg-white p-6 backdrop-blur-xl shadow-lg">
                <h3 className="text-2xl font-black text-[#1f4d35] mb-2">
                  Judge Demo Flow
                </h3>

                <p className="text-[#1f2e24]/75">
                  AI VAIDYA demonstrates hybrid Ayurveda RAG, CLIP + Gemini visual
                  analysis, Prakriti personalization, Dinacharya generation, recipe
                  recommendation, multilingual answers, voice interaction, saved
                  history, and a cinematic 3D landing experience in one connected
                  workflow.
                </p>
              </div>
            </FadeIn>

            <div className="grid xl:grid-cols-[1fr_430px] gap-6">
              <FadeIn delay={0.12}>
                <MainPanel title="Ayurveda Intelligence Workspace" subtitle="Semantic + Keyword + Vision-Augmented Retrieval">
                  <div className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full mb-4 rounded-2xl border border-[#8daa7b]/40 bg-white p-4 outline-none text-[#1f2e24]"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Kannada">Kannada</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Gujarati">Gujarati</option>
                    </select>

                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask by text or voice about herbs, doshas, skin wellness, Ayurveda practices..."
                      className="w-full bg-transparent outline-none min-h-[150px] resize-none text-lg text-[#1f2e24] placeholder:text-[#1f2e24]/40"
                    />

                    <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-[#1f2e24]/55">
                        <Sparkles size={16} />
                        Hybrid Ayurveda Intelligence
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={startVoiceInput}
                          disabled={listening}
                          className="p-3 rounded-2xl border border-[#8daa7b]/40 bg-[#edf3e8] text-[#1f4d35] hover:bg-[#dbead4] transition-all disabled:opacity-60"
                          title="Voice input"
                        >
                          {listening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>

                        <button
                          onClick={handleAsk}
                          disabled={loading}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2f6b45] to-[#8daa7b] text-white font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-60"
                        >
                          {loading ? "Thinking..." : "Ask AI VAIDYA"}
                        </button>
                      </div>
                    </div>

                    {listening && (
                      <p className="mt-3 text-sm text-[#1f4d35] animate-pulse">
                        Listening... speak your question now.
                      </p>
                    )}
                  </div>

                  {answer && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 space-y-4"
                    >
                      <ChatBubble role="user" text={query} />

                      <div>
                        <ChatBubble role="assistant" text={answer} />

                        <div className="mt-3 flex gap-3 flex-wrap">
                          <button
                            onClick={() => speakText(answer)}
                            className="px-4 py-2 rounded-xl bg-white border border-[#8daa7b]/35 text-[#1f4d35] flex items-center gap-2"
                          >
                            <Volume2 size={16} />
                            Read Aloud
                          </button>

                          {speaking && (
                            <button
                              onClick={stopSpeaking}
                              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 flex items-center gap-2"
                            >
                              <Square size={16} />
                              Stop
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {sources.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-bold text-[#123425] mb-3">
                        Retrieval Sources
                      </h4>

                      <div className="flex flex-wrap gap-3">
                        {sources.map((source, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 rounded-2xl border border-[#8daa7b]/35 bg-white"
                          >
                            <p className="font-semibold text-[#123425] text-sm">
                              {source.source}
                            </p>

                            <p className="text-xs text-[#1f2e24]/55 mt-1">
                              {source.retrieval_type} • {source.score}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </MainPanel>
              </FadeIn>

              <FadeIn delay={0.18}>
                <MainPanel title="AyurVision Scanner" icon={<ScanLine />}>
                  <div className="space-y-5">
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="w-full rounded-2xl border border-[#8daa7b]/40 bg-white p-4 outline-none text-[#1f2e24]"
                    >
                      <option value="skin">Skin Analysis</option>
                      <option value="tongue">Tongue Analysis</option>
                      <option value="herb">Herb Detection</option>
                      <option value="symptom">Symptom Detection</option>
                    </select>

                    <label className="rounded-3xl border-2 border-dashed border-[#8daa7b]/50 bg-[#edf3e8]/75 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#dbead4] transition-all">
                      <Upload className="mb-3 text-[#1f4d35]" size={36} />

                      <p className="font-semibold text-[#123425]">
                        Upload Ayurveda Image
                      </p>

                      <p className="text-sm text-[#1f2e24]/55 mt-1">
                        JPG • PNG • WEBP
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {preview && (
                      <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={preview}
                        alt="Preview"
                        className="w-full h-[260px] object-cover rounded-3xl border border-[#8daa7b]/40"
                      />
                    )}

                    <button
                      onClick={handleVisionAnalyze}
                      disabled={loading || !image}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2f6b45] to-[#8daa7b] text-white font-black text-lg hover:scale-[1.02] transition-all shadow-lg disabled:opacity-60"
                    >
                      {loading ? "Analyzing Visual Patterns..." : "Analyze With Hybrid AI"}
                    </button>

                    {loading && (
                      <div className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5 space-y-3">
                        <LoadingLine text="Scanning image features..." />
                        <LoadingLine text="Running CLIP classification..." />
                        <LoadingLine text="Extracting Ayurveda context..." />
                        <LoadingLine text="Generating wellness guidance..." />
                      </div>
                    )}
                  </div>
                </MainPanel>
              </FadeIn>
            </div>

            {visionResult && (
              <FadeIn>
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-[32px] border border-[#8daa7b]/40 bg-white backdrop-blur-xl overflow-hidden shadow-lg"
                >
                  <div className="border-b border-[#8daa7b]/25 px-6 py-5">
                    <h3 className="text-3xl font-black text-[#123425]">
                      Hybrid Vision Intelligence Result
                    </h3>
                    <p className="text-[#1f2e24]/55 mt-1">
                      CLIP + Gemini Vision + Hybrid RAG
                    </p>
                  </div>

                  <div className="p-6 grid lg:grid-cols-3 gap-6">
                    <VisionCard
                      title="Top Prediction"
                      content={
                        <div>
                          <div className="text-3xl font-black text-[#123425] mb-2 capitalize">
                            {visionResult.clip_prediction?.label}
                          </div>

                          <div className="w-full h-4 rounded-full bg-[#dbead4] overflow-hidden mb-2">
                            <div
                              className="h-full bg-gradient-to-r from-[#2f6b45] to-[#8daa7b]"
                              style={{
                                width: `${visionResult.clip_prediction?.confidence}%`,
                              }}
                            />
                          </div>

                          <p className="text-[#1f2e24]/60 text-sm">
                            Confidence: {visionResult.clip_prediction?.confidence}%
                          </p>
                        </div>
                      }
                    />

                    <VisionCard
                      title="AI Pipeline"
                      content={
                        <div className="space-y-3 text-sm text-[#1f2e24]/80">
                          <PipelineStep text="Image Uploaded" />
                          <PipelineStep text="CLIP Visual Classification" />
                          <PipelineStep text="Gemini Visual Reasoning" />
                          <PipelineStep text="Hybrid Ayurveda Retrieval" />
                          <PipelineStep text="Wellness Guidance Generated" />
                        </div>
                      }
                    />

                    <VisionCard
                      title="Top Predictions"
                      content={
                        <div className="space-y-3">
                          {visionResult.top_5_predictions?.map((item, index) => (
                            <div key={index}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">{item.label}</span>
                                <span>{item.confidence}%</span>
                              </div>

                              <div className="w-full h-2 rounded-full bg-[#dbead4] overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#1f4d35] to-[#8daa7b]"
                                  style={{ width: `${item.confidence}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      }
                    />
                  </div>

                  <div className="px-6 pb-6 grid lg:grid-cols-2 gap-6">
                    <ResultPanel
                      title="Gemini Visual Analysis"
                      text={visionResult.gemini_visual_analysis}
                    />

                    <div>
                      <ResultPanel
                        title="Ayurveda Intelligence Guidance"
                        text={visionResult.rag_answer}
                      />

                      <div className="mt-3 flex gap-3 flex-wrap">
                        <button
                          onClick={() => speakText(visionResult.rag_answer)}
                          className="px-4 py-2 rounded-xl bg-white border border-[#8daa7b]/35 text-[#1f4d35] flex items-center gap-2"
                        >
                          <Volume2 size={16} />
                          Read Vision Guidance
                        </button>

                        {speaking && (
                          <button
                            onClick={stopSpeaking}
                            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 flex items-center gap-2"
                          >
                            <Square size={16} />
                            Stop
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.section>
              </FadeIn>
            )}

            <PrakritiSection
              questions={questions}
              answers={answers}
              selectAnswer={selectAnswer}
              handlePrakritiAnalyze={handlePrakritiAnalyze}
              loading={loading}
              prakritiResult={prakritiResult}
              handleDinacharyaGenerate={handleDinacharyaGenerate}
              recipeCondition={recipeCondition}
              setRecipeCondition={setRecipeCondition}
              handleRecipeRecommend={handleRecipeRecommend}
              dinacharyaResult={dinacharyaResult}
              recipeResult={recipeResult}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function MainPanel({ title, subtitle, icon, children }) {
  return (
    <motion.section
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="rounded-[32px] border border-[#8daa7b]/40 bg-white backdrop-blur-xl overflow-hidden shadow-lg"
    >
      <div className="border-b border-[#8daa7b]/25 px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#123425] flex items-center gap-2">
            {icon}
            {title}
          </h3>
          {subtitle && (
            <p className="text-[#1f2e24]/55 text-sm mt-1">{subtitle}</p>
          )}
        </div>

        <div className="w-3 h-3 rounded-full bg-[#8daa7b] animate-pulse" />
      </div>

      <div className="p-6">{children}</div>
    </motion.section>
  );
}

function PrakritiSection({
  questions,
  answers,
  selectAnswer,
  handlePrakritiAnalyze,
  loading,
  prakritiResult,
  handleDinacharyaGenerate,
  recipeCondition,
  setRecipeCondition,
  handleRecipeRecommend,
  dinacharyaResult,
  recipeResult,
}) {
  return (
    <FadeIn delay={0.22}>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-[32px] border border-[#8daa7b]/40 bg-white backdrop-blur-xl overflow-hidden shadow-lg"
      >
        <div className="border-b border-[#8daa7b]/25 px-6 py-5">
          <h3 className="text-3xl font-black text-[#123425]">
            Prakriti Intelligence Analyzer
          </h3>

          <p className="text-[#1f2e24]/55 mt-1">
            Discover your Vata, Pitta and Kapha balance through an interactive quiz.
          </p>
        </div>

        <div className="p-6 grid xl:grid-cols-[1fr_430px] gap-6">
          <div className="space-y-5">
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                transition={{ delay: index * 0.025 }}
                className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5 shadow-sm"
              >
                <p className="text-[#123425] font-bold mb-4">
                  {index + 1}. {q.question}
                </p>

                <div className="grid md:grid-cols-3 gap-3">
                  {q.options.map((option) => {
                    const active = answers[q.id] === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => selectAnswer(q.id, option.value)}
                        className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                          active
                            ? "bg-[#2f6b45] text-white border-[#1f4d35] shadow-lg scale-[1.02]"
                            : "bg-[#f7fbf4] border-[#8daa7b]/35 text-[#1f2e24] hover:border-[#1f4d35]/50 hover:bg-[#edf3e8]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            <button
              onClick={handlePrakritiAnalyze}
              disabled={loading || questions.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2f6b45] to-[#8daa7b] text-white font-black text-lg hover:scale-[1.01] transition-all disabled:opacity-60 shadow-lg"
            >
              {loading ? "Analyzing Prakriti..." : "Analyze My Prakriti"}
            </button>
          </div>

          <div className="space-y-5">
            {!prakritiResult && (
              <div className="rounded-3xl border border-[#8daa7b]/35 bg-white p-6 shadow-sm sticky top-6">
                <h4 className="text-2xl font-bold text-[#123425] mb-3">
                  Your Dosha Result
                </h4>

                <p className="text-[#1f2e24]/65 leading-relaxed">
                  Complete the quiz to generate your Prakriti type, dosha percentages,
                  lifestyle guidance, herbs and daily routine suggestions.
                </p>
              </div>
            )}

            {prakritiResult && (
              <>
                <div className="rounded-3xl border border-[#8daa7b]/35 bg-white p-6 shadow-sm">
                  <h4 className="text-2xl font-black text-[#123425] mb-2">
                    {prakritiResult.prakriti_type}
                  </h4>

                  <p className="text-[#1f2e24]/70 mb-5">
                    {prakritiResult.explanation}
                  </p>

                  {Object.entries(prakritiResult.scores || {}).map(
                    ([dosha, score]) => (
                      <div key={dosha} className="mb-4">
                        <div className="flex justify-between mb-1 capitalize">
                          <span>{dosha}</span>
                          <span>{score}%</span>
                        </div>

                        <div className="w-full h-3 rounded-full bg-[#dbead4] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-[#1f4d35] to-[#8daa7b]"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                <RecommendationCard title="Diet" items={prakritiResult.recommendations?.diet} />
                <RecommendationCard title="Avoid" items={prakritiResult.recommendations?.avoid} />
                <RecommendationCard title="Suitable Herbs" items={prakritiResult.recommendations?.herbs} />

                <button
                  onClick={handleDinacharyaGenerate}
                  className="w-full py-3 rounded-2xl bg-[#1f4d35] text-white font-bold shadow-md hover:scale-[1.01] transition-all"
                >
                  Generate Dinacharya
                </button>

                <div className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5 shadow-sm">
                  <h4 className="text-xl font-bold text-[#123425] mb-3">
                    Recipe Recommendation
                  </h4>

                  <select
                    value={recipeCondition}
                    onChange={(e) => setRecipeCondition(e.target.value)}
                    className="w-full rounded-2xl border border-[#8daa7b]/40 bg-white p-3 outline-none mb-3 text-[#1f2e24]"
                  >
                    <option value="cough">Cough / Cold</option>
                    <option value="digestion">Digestion</option>
                    <option value="stress">Stress / Sleep</option>
                  </select>

                  <button
                    onClick={handleRecipeRecommend}
                    className="w-full py-3 rounded-2xl bg-[#2f6b45] text-white font-bold shadow-md hover:scale-[1.01] transition-all"
                  >
                    Recommend Ayurvedic Recipe
                  </button>
                </div>
              </>
            )}

            {dinacharyaResult && (
              <ResultBox title="Dinacharya Plan">
                {Object.entries(dinacharyaResult.daily_routine || {}).map(
                  ([time, steps]) => (
                    <div key={time} className="mb-4">
                      <p className="capitalize font-bold text-[#1f4d35] mb-2">
                        {time}
                      </p>

                      <ul className="space-y-1 text-[#1f2e24]/75">
                        {steps.map((step, index) => (
                          <li key={index}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </ResultBox>
            )}

            {recipeResult && (
              <ResultBox title={recipeResult.recommended_recipe?.name}>
                <p className="text-[#1f2e24]/65 mb-4">
                  {recipeResult.simple_explanation}
                </p>

                <p className="font-bold text-[#1f4d35] mb-2">Ingredients</p>

                <ul className="mb-4 text-[#1f2e24]/75">
                  {recipeResult.recommended_recipe?.ingredients?.map(
                    (item, index) => (
                      <li key={index}>• {item}</li>
                    )
                  )}
                </ul>

                <p className="font-bold text-[#1f4d35] mb-2">Steps</p>

                <ol className="space-y-1 text-[#1f2e24]/75">
                  {recipeResult.recommended_recipe?.steps?.map(
                    (step, index) => (
                      <li key={index}>
                        {index + 1}. {step}
                      </li>
                    )
                  )}
                </ol>
              </ResultBox>
            )}
          </div>
        </div>
      </motion.section>
    </FadeIn>
  );
}

function SidebarCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, x: 3 }}
      className="rounded-3xl border border-white/15 bg-white/14 p-4 cursor-pointer hover:bg-white/20 transition-all"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/15 flex items-center justify-center text-white">
          {icon}
        </div>

        <div>
          <p className="font-bold text-white">{title}</p>
          <p className="text-xs text-white/75">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ value, label }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5 backdrop-blur-xl shadow-md"
    >
      <div className="text-2xl font-black text-[#123425] mb-1">{value}</div>
      <div className="text-sm text-[#1f2e24]/55">{label}</div>
    </motion.div>
  );
}

function ChatBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-3xl px-5 py-4 whitespace-pre-wrap leading-relaxed shadow-sm ${
          isUser
            ? "bg-[#2f6b45] text-white"
            : "bg-white border border-[#8daa7b]/35 text-[#1f2e24]"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function VisionCard({ title, content }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5 shadow-sm"
    >
      <h4 className="text-xl font-bold text-[#123425] mb-4">{title}</h4>
      {content}
    </motion.div>
  );
}

function ResultPanel({ title, text }) {
  return (
    <div className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5 shadow-sm">
      <h4 className="text-2xl font-bold text-[#123425] mb-4">{title}</h4>

      <div className="whitespace-pre-wrap leading-relaxed text-[#1f2e24]/85 max-h-[500px] overflow-y-auto pr-2">
        {text}
      </div>
    </div>
  );
}

function ResultBox({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5 shadow-sm"
    >
      <h4 className="text-2xl font-bold text-[#123425] mb-4">{title}</h4>
      {children}
    </motion.div>
  );
}

function PipelineStep({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full bg-[#2f6b45]" />
      <span>{text}</span>
    </div>
  );
}

function LoadingLine({ text }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2 text-[#1f2e24]/70">
        <span>{text}</span>
        <span>processing...</span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#dbead4] overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="h-full w-1/3 bg-gradient-to-r from-[#2f6b45] to-[#8daa7b]"
        />
      </div>
    </div>
  );
}

function RecommendationCard({ title, items = [] }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-[#8daa7b]/35 bg-white p-5 shadow-sm"
    >
      <h4 className="text-xl font-bold text-[#123425] mb-3">{title}</h4>

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="px-3 py-2 rounded-full bg-[#edf3e8] border border-[#8daa7b]/35 text-sm text-[#1f2e24]"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default App;