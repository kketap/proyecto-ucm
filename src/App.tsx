import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";

/* ===========================
   TIPOS MEJORADOS
=========================== */

interface NavItem {
  id: string;
  label: string;
}

interface ServicioItem {
  title: string;
  desc: string;
  img: string;
  icon: string;
}

interface BenefitItem {
  title: string;
  icon: string;
  desc?: string;
}

interface TestimonioItem {
  nombre: string;
  rol: string;
  texto: string;
  rating?: number;
}

/* ===========================
   CONSTANTES ENRIQUECIDAS
=========================== */

const NAV_ITEMS: NavItem[] = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Quiénes Somos" },
  { id: "servicios", label: "Servicios" },
  { id: "flota", label: "Flota" },
  { id: "cobertura", label: "Cobertura" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

const SERVICIOS: ServicioItem[] = [
  {
    title: "Unidad Coronaria Móvil",
    desc: "Ambulancias equipadas con tecnología avanzada para soporte crítico con monitoreo cardíaco continuo.",
    img: "/images/ambulancia1.jpeg",
    icon: "🚑",
  },
  {
    title: "Emergencias 24/7",
    desc: "Equipo profesional capacitado para atención inmediata las 24 horas del día, los 365 días del año.",
    img: "/images/paramedico1.jpeg",
    icon: "⚠️",
  },
  {
    title: "Atención Domiciliaria",
    desc: "Profesionales de salud llegan directamente a tu hogar con equipamiento completo de emergencias.",
    img: "/images/familia1.jpeg",
    icon: "🏥",
  },
  {
    title: "Telemedicina",
    desc: "Video consulta médica integral con capacidad de entregar receta de medicamentos y órdenes médicas.",
    img: "/images/telemedicina.png",
    icon: "💻"
  },
  {
    title: "Atención de Urgencias y Orientación Médica Telefónica",
    desc: "Atención de emergencias, urgencias y orientación médica telefónica para evaluar síntomas y entregar indicaciones inmediatas.",
    img: "/images/urgencias.jpg",
    icon: "📞",
  },
];

const FLEET_IMAGES = [
  {
    src: "/images/ambulancia5.jpg",
    title: "Móvil VIR – Vehículo de Intervención Rápida para Atenciones Programadas"
  },
  { src: "/images/ambulancia3.jpeg", title: "UCM Equipada" },
  { src: "/images/ambulancia4.jpeg", title: "UCM Emergencia" },
];

const BENEFICIOS: BenefitItem[] = [
  {
    title: "Más de 15 años de experiencia",
    icon: "🏅",
    desc: "Líderes en atención médica de urgencia"
  },
  {
    title: "Profesionales certificados",
    icon: "🩺",
    desc: "Médicos y paramédicos especializados"
  },
  {
    title: "Miles de familias atendidas",
    icon: "👨‍👩‍👧‍👦",
    desc: "Más de 5,000 emergencias atendidas"
  },
];

const TESTIMONIOS: TestimonioItem[] = [
  {
    nombre: "María González",
    rol: "Familiar de paciente",
    texto: "La atención fue rápida y muy humana. Nos sentimos acompañados en todo momento durante la emergencia.",
    rating: 5
  },
  {
    nombre: "Carlos Rivera",
    rol: "Cliente corporativo",
    texto: "Su servicio ha sido clave en nuestra empresa. Muy confiables y profesionales en cada intervención.",
    rating: 5
  },
  {
    nombre: "Ana Pérez",
    rol: "Paciente",
    texto: "Llegaron en pocos minutos y me atendieron con gran dedicación. Salvaron mi vida literalmente.",
    rating: 5
  },
];

const CONTACT_INFO = {
  whatsapp: "56991880520",
  telefono: "+56 9 9188 0520",
} as const;

/* ===========================
   ANIMACIONES MEJORADAS
=========================== */

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any },
  viewport: { once: true, margin: "-50px" },
};

const fadeInUpDelayed = (delay = 0.2) => ({
  ...fadeInUp,
  transition: { ...fadeInUp.transition, delay },
});

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

/* ===========================
   HOOKS PERSONALIZADOS MEJORADOS
=========================== */

const useScrollSpy = (ids: string[], offset = 120) => {
  const [active, setActive] = useState<string>(ids[0]);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      const scrollPosition = y + offset;
      let current = ids[0];

      // Mejor detección de secciones - recorrer en reversa
      for (let i = ids.length - 1; i >= 0; i--) {
        const id = ids[i];
        const el = document.getElementById(id);
        if (el && scrollPosition >= el.offsetTop + 100) {
          current = id;
          break;
        }
      }

      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return { activeSection: active, scrolled };
};

const useSmoothScroll = () =>
  useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const navHeight = 80;
    const elementTop = el.offsetTop - navHeight;

    window.scrollTo({
      top: elementTop,
      behavior: "smooth",
    });
  }, []);

/* ===========================
   COMPONENTES REUTILIZABLES MEJORADOS
=========================== */

const ServiceCard = ({ data, index, className = "" }: { data: ServicioItem; index: number; className?: string }) => (
  <motion.div
    {...fadeInUpDelayed(index * 0.15)}
    whileHover={{
      y: -12,
      scale: 1.02,
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
    }}
    className={`group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-500 ${className}`}
  >
    <div className="relative h-64 overflow-hidden">
      <motion.img
        src={data.img}
        alt={data.title}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        width={400}
        height={256}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-4 left-4 text-3xl bg-white/20 backdrop-blur rounded-lg p-2">
        {data.icon}
      </div>
    </div>

    <div className="p-6 sm:p-8">
      <h4 className="font-bold text-xl sm:text-2xl text-ucmBlue mb-4 group-hover:text-ucmOrange transition-colors">
        {data.title}
      </h4>
      <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{data.desc}</p>

      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "60px" }}
        transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
        className="h-1 bg-ucmOrange mt-4 rounded-full"
      />
    </div>
  </motion.div>
);

const TestimonialCard = ({ testimonio, index }: { testimonio: TestimonioItem; index: number }) => (
  <motion.div
    {...fadeInUpDelayed(index * 0.2)}
    whileHover={{ y: -5 }}
    className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    {/* Rating Stars */}
    <div className="flex gap-1 mb-4">
      {[...Array(testimonio.rating || 5)].map((_, i) => (
        <span key={i} className="text-ucmOrange text-lg">★</span>
      ))}
    </div>

    <p className="text-gray-700 text-base sm:text-lg leading-relaxed italic mb-6">
      "{testimonio.texto}"
    </p>

    <div className="border-t border-gray-200 pt-4">
      <h4 className="font-bold text-ucmBlue text-lg">{testimonio.nombre}</h4>
      <p className="text-gray-500 text-sm">{testimonio.rol}</p>
    </div>
  </motion.div>
);

const WhatsAppButton = () => (
  <motion.a
    href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    whileHover={{
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }}
    whileTap={{ scale: 0.95 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }}
    className="fixed bottom-6 right-6 z-40 group"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Contactar por WhatsApp para emergencias médicas"
  >
    <div className="relative">
      <div className="w-14 sm:w-16 h-14 sm:h-16 bg-green-500 rounded-full shadow-2xl flex items-center justify-center text-xl sm:text-2xl text-white hover:bg-green-600 transition-colors">
        💬
      </div>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 sm:mr-4 top-1/2 transform -translate-y-1/2">
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          ¿Necesitas ayuda?
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
        </div>
      </div>

      {/* Ping animation */}
      <motion.div
        className="absolute inset-0 border-2 border-green-500 rounded-full"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />
    </div>
  </motion.a>
);

/* ===========================
   COMPONENTE PRINCIPAL MEJORADO
=========================== */

export default function App() {
  const { activeSection, scrolled } = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  const scrollTo = useSmoothScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  const navClasses = useMemo(() =>
    scrolled
      ? "bg-ucmBlue/95 backdrop-blur-md shadow-2xl border-b border-white/10"
      : "bg-transparent",
    [scrolled]
  );

  const handleNavClick = useCallback((id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  }, [scrollTo]);

  return (
    <div className="font-sans bg-white text-gray-800 scroll-smooth">
      {/* =====================================================
          NAVBAR MEJORADO
      ===================================================== */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-500 text-white ${navClasses}`}
        aria-label="Navegación principal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo Mejorado */}
          <motion.button
            onClick={() => handleNavClick("inicio")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src="/images/Logo.jpg"
                alt="UCM - Unidad Coronaria Móvil"
                className="h-10 sm:h-12 w-auto bg-white p-1 rounded-xl shadow-lg object-contain"
                loading="lazy"
                decoding="async"
              />
              <motion.div
                className="absolute inset-0 border-2 border-ucmOrange rounded-xl opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-left">
              <span className="font-bold text-lg sm:text-xl block leading-tight">UCM</span>
              <span className="text-white/70 text-xs block">Unidad Coronaria Móvil</span>
            </div>
          </motion.button>

          {/* Desktop Menu Mejorado */}
          <ul className="hidden lg:flex gap-6 xl:gap-8 font-medium items-center">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 transition-all duration-300 ${activeSection === item.id
                    ? "text-ucmOrange font-semibold"
                    : "text-white/90 hover:text-ucmOrange"
                    }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-ucmOrange rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button Mejorado */}
          <motion.button
            className="lg:hidden flex flex-col gap-1.5 p-2 group"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Menú de navegación"
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 8 : 0,
                width: menuOpen ? 24 : 20
              }}
              className="block h-0.5 bg-white transition-all duration-300"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className="block h-0.5 bg-white w-6 transition-all duration-300"
            />
            <motion.span
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -8 : 0,
                width: menuOpen ? 24 : 20
              }}
              className="block h-0.5 bg-white transition-all duration-300"
            />
          </motion.button>
        </div>

        {/* Mobile Menu con AnimatePresence */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-ucmBlue/95 backdrop-blur-lg border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    whileHover={{ x: 5 }}
                    className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ${activeSection === item.id
                      ? "bg-white/10 text-ucmOrange font-semibold"
                      : "text-white hover:bg-white/5 hover:text-ucmOrange"
                      }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* =====================================================
          HERO MEJORADO
      ===================================================== */}
      <section
        id="inicio"
        className="
    min-h-screen 
    bg-cover 
    bg-center 
    sm:bg-fixed 
    bg-no-repeat 
    relative 
    flex 
    items-center 
    justify-center 
    overflow-hidden
  "
        style={{
          backgroundImage: "url('/images/atencion-medica.avif')",
          backgroundPosition: "center top",
        }}
      >
        {/* Overlay mejorado */}
        <div className="absolute inset-0 bg-gradient-to-br from-ucmBlue/80 via-ucmBlue/60 to-transparent" />

        {/* Elemento decorativo */}
        <div className="absolute top-1/4 right-4 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-ucmOrange/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-4 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center text-white max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-6 sm:mb-8"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Seguridad y
              <br />
              <span className="text-ucmOrange">Atención Médica</span>
              <br />
              para tu Familia
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Unidad Coronaria Móvil · Emergencias 24/7 ·
              <span className="block mt-1 sm:mt-2">Profesionales Certificados</span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-ucmOrange text-white font-bold px-6 sm:px-10 py-4 rounded-2xl text-base sm:text-lg shadow-2xl hover:bg-orange-600 transition-all duration-300 flex items-center gap-3 group w-full sm:w-auto justify-center"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp para emergencias médicas"
            >
              <span className="text-xl transition-transform group-hover:scale-110">💬</span>
              Emergencia - WhatsApp
            </motion.a>

            <motion.button
              onClick={() => handleNavClick("servicios")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/15 backdrop-blur text-white font-bold px-6 sm:px-10 py-4 rounded-2xl text-base sm:text-lg border border-white/30 hover:bg-white/25 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span className="text-lg">↓</span>
              Conocer Servicios
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator Mejorado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-2 text-white/70 cursor-pointer"
            onClick={() => handleNavClick("nosotros")}
          >
            <span className="text-sm font-medium">Conocer más</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 bg-white/70 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* =====================================================
          QUIÉNES SOMOS MEJORADO
      ===================================================== */}
      <section id="nosotros" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h3
              {...fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-ucmBlue mb-6"
            >
              Quiénes Somos
            </motion.h3>

            <motion.div
              {...fadeInUpDelayed(0.2)}
              className="max-w-4xl mx-auto"
            >
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
                Con más de <strong className="text-ucmBlue">40 años de experiencia</strong> y la confianza de
                <strong className="text-ucmBlue"> 600.000 personas</strong>, ofrecemos Servicios de Salud y
                Rescate Médico con los más altos estándares de calidad.
              </p>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
                Nuestro compromiso es brindar atención médica rápida, segura y profesional
                cuando más lo necesitas.
              </p>

              <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
                {BENEFICIOS.map((beneficio, index) => (
                  <motion.div
                    key={beneficio.title}
                    {...fadeInUpDelayed(index * 0.1)}
                    whileHover={{ y: -5 }}
                    className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-4xl mb-4">{beneficio.icon}</div>
                    <h4 className="font-bold text-ucmBlue text-lg mb-2">{beneficio.title}</h4>
                    <p className="text-gray-600 text-sm">{beneficio.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SERVICIOS MEJORADO
      ===================================================== */}
      <section id="servicios" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.h3
              {...fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-ucmBlue mb-6"
            >
              Nuestros Servicios
            </motion.h3>

            <motion.p
              {...fadeInUpDelayed(0.2)}
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Servicios médicos de emergencia las 24 horas del día,
              con equipamiento de última generación y personal altamente calificado.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
          >
            {SERVICIOS.map((servicio, index) => (
              <ServiceCard
                key={servicio.title}
                data={servicio}
                index={index}
                className={
                  index === SERVICIOS.length - 1 && SERVICIOS.length % 2 !== 0
                    ? "md:col-span-2 xl:col-span-1"
                    : ""
                }
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FLOTA MEJORADA
      ===================================================== */}
      <section id="flota" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h3
              {...fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-ucmBlue mb-6"
            >
              Nuestra Flota
            </motion.h3>

            <motion.p
              {...fadeInUpDelayed(0.2)}
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Vehículos equipados con tecnología médica avanzada para garantizar
              la mejor atención en cada emergencia.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center max-w-4xl mx-auto">
            {FLEET_IMAGES.map((item, index) => (
              <motion.div
                key={item.src}
                {...fadeInUpDelayed(index * 0.1)}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 w-full max-w-md"
              >
                <div className="aspect-square overflow-hidden">
                  <motion.img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={400}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-white font-bold text-base sm:text-lg text-center">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          COBERTURA MEJORADA
      ===================================================== */}
      <section id="cobertura" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-ucmBlue to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h3
              {...fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-6"
            >
              Cobertura Nacional e Internacional
            </motion.h3>

            <motion.p
              {...fadeInUpDelayed(0.2)}
              className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Operamos en Chile y formamos parte de una red de servicios médicos
              presente en más de 15 países de Latinoamérica.
            </motion.p>

            {/* === 📌 MAPA DE COBERTURA === */}
            <motion.div
              {...fadeInUpDelayed(0.4)}
              className="flex justify-center items-center mb-8 sm:mb-12"
            >
              <img
                src="/images/mapa-ucm-red.jpg"
                alt="Mapa de cobertura UCM mostrando presencia en más de 15 países de Latinoamérica"
                className="max-w-full w-full sm:w-[700px] md:w-[900px] drop-shadow-2xl rounded-lg"
                loading="lazy"
                decoding="async"
                width={900}
                height={500}
              />
            </motion.div>

            {/* === Tarjetas de Cobertura === */}
            <motion.div
              {...fadeInUpDelayed(0.5)}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-4">🌎</div>
                <h4 className="font-bold text-lg mb-2">Cobertura Internacional</h4>
                <p className="text-white/80 text-sm sm:text-base">
                  Atención en más de 15 países de Latinoamérica a través de red SIEM.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-4">📍</div>
                <h4 className="font-bold text-lg mb-2">Cobertura Nacional </h4>
                <p className="text-white/80 text-sm sm:text-base">
                  Disponible 24/7 en la región metropolitana y v región.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 md:col-span-2 lg:col-span-1">
                <div className="text-3xl mb-4">🔄</div>
                <h4 className="font-bold text-lg mb-2">Disponibilidad 24/7</h4>
                <p className="text-white/80 text-sm sm:text-base">
                  Servicio continuo todos los días del año.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIOS MEJORADOS
      ===================================================== */}
      <section id="testimonios" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h3
              {...fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-ucmBlue mb-6"
            >
              Lo Que Dicen Nuestros Pacientes
            </motion.h3>

            <motion.p
              {...fadeInUpDelayed(0.2)}
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              La confianza de las familias que hemos atendido nos impulsa a seguir mejorando cada día.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {TESTIMONIOS.map((testimonio, index) => (
              <TestimonialCard key={testimonio.nombre} testimonio={testimonio} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CONTACTO MEJORADO
      ===================================================== */}
      <section id="contacto" className="py-16 sm:py-20 lg:py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h3
              {...fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-6"
            >
              Cotiza tu plan
            </motion.h3>

            <motion.p
              {...fadeInUpDelayed(0.2)}
              className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto"
            >
              ¿Necesitas ayuda inmediata? Estamos disponibles las 24 horas para atender tu emergencia.
            </motion.p>

            <motion.div
              {...fadeInUpDelayed(0.4)}
              className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8 sm:mb-12 max-w-2xl mx-auto"
            >
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                className="bg-green-500 hover:bg-green-600 p-6 rounded-2xl text-center transition-all duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp para emergencias médicas"
              >
                <div className="text-3xl mb-3">💬</div>
                <div className="font-bold text-lg mb-2">WhatsApp</div>
                <div className="text-green-100 text-sm">Respuesta inmediata</div>
              </a>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FOOTER MEJORADO
      ===================================================== */}
      <footer className="bg-ucmBlue text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8 text-center lg:text-left">
            <div className="flex-1 max-w-md">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4">
                <img
                  src="/images/Logo.jpg"
                  alt="UCM - Unidad Coronaria Móvil"
                  className="h-14 sm:h-16 w-auto bg-white p-2 rounded-xl shadow-lg object-contain"
                  loading="lazy"
                  decoding="async"
                  width={64}
                  height={64}
                />
                <div>
                  <div className="font-bold text-xl sm:text-2xl">UCM</div>
                  <div className="text-white/70 text-sm">Unidad Coronaria Móvil</div>
                </div>
              </div>
              <p className="text-white/70 text-sm sm:text-base">
                Servicios médicos de emergencia las 24 horas del día,
                comprometidos con la salud y bienestar de tu familia.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-end">
              {NAV_ITEMS.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg hover:bg-white/10"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-white/60 text-xs sm:text-sm">
            <p>© 2025 UCM — Unidad Coronaria Móvil. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}