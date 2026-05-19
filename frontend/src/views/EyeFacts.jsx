import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Droplets, Monitor, Sun, Leaf, Droplet, 
  Ban, Umbrella, ShieldAlert, Sparkles, 
  EyeOff, Search, Activity, Lightbulb, BookOpen 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const factsData = [
  {
    category: "Daily Habits & Screen Health",
    items: [
      {
        title: "20-20-20 Rule",
        fact: "Every 20 minutes, look at something 20 feet away for 20 seconds to help prevent digital eye strain.",
        icon: <Monitor size={20} className="text-emerald-400" />,
        imageUrl: "https://images.unsplash.com/photo-1523956468692-1e219561ea46?auto=format&fit=crop&w=400&h=250&q=80",
        link: "https://www.aao.org/eye-health/tips-prevention/computer-usage"
      },
      {
        title: "Blink More, Dry Less",
        fact: "People blink 66% less often during computer use, which leads to dry, irritated eyes.",
        icon: <Droplets size={20} className="text-emerald-400" />,
        imageUrl: "https://media.istockphoto.com/id/1368955041/photo/woman-using-eye-drop-woman-dropping-eye-lubricant-to-treat-dry-eye-or-allergy-sick-woman.webp?b=1&s=170667a&w=0&k=20&c=0qHd6OxCREjhzv2_U-hBd1_mV_lSB0Ufj35oQD54_9o=",
        link: "https://www.mayoclinic.org/diseases-conditions/dry-eyes/symptoms-causes/syc-20371863"
      },
      {
        title: "Screen Distance & Position",
        fact: "Your screen should be 20-26 inches from your eyes, with the top of the screen at or just below eye level.",
        icon: <Eye size={20} className="text-emerald-400" />,
        imageUrl: "https://images.unsplash.com/photo-1675151638960-fc1513f8021e?auto=format&fit=crop&w=400&h=250&q=80",
        link: "https://www.osha.gov/etools/computer-workstations"
      },
      {
        title: "Blue Light: Myth vs Fact",
        fact: "Blue light from screens doesn’t cause eye damage, but it can disrupt your sleep cycle if used before bed.",
        icon: <Sun size={20} className="text-emerald-400" />,
        imageUrl: "https://media.istockphoto.com/photos/cropped-shot-of-a-man-using-his-cellphone-while-lying-in-bed-at-night-picture-id1326517784?b=1&k=20&m=1326517784&s=170667a&w=0&h=G087vExTsK7LEa_1ChCT9wo4GzcCzFbVXZyVLjtsNLw=",
        link: "https://www.health.harvard.edu/staying-healthy/blue-light-has-a-dark-side"
      }
    ]
  },
  {
    category: "Nutrition & Lifestyle",
    items: [
      {
        title: "Foods for Healthy Eyes",
        fact: "Nutrients like lutein, zeaxanthin, vitamin C, vitamin E, and omega-3s help ward off age-related vision problems. Find them in leafy greens, fish, eggs, and nuts.",
        icon: <Leaf size={20} className="text-emerald-400" />,
        imageUrl: "https://media.istockphoto.com/photos/brown-bear-and-the-salmon-picture-id1037184184?b=1&k=20&m=1037184184&s=170667a&w=0&h=fT8IEf0dlXIhoMfrV2Ib3TQy-cJyB73wYKzv1gc7P9k=",
        link: "https://www.nei.nih.gov/learn-about-eye-health/healthy-vision/keep-your-eyes-healthy"
      },
      {
        title: "Hydration & Your Eyes",
        fact: "Being dehydrated can reduce your body’s ability to produce tears, leading to dry eye symptoms.",
        icon: <Droplet size={20} className="text-emerald-400" />,
        imageUrl: "https://media.istockphoto.com/id/485685046/photo/glass-of-water.webp?a=1&b=1&s=612x612&w=0&k=20&c=jGOYK8a8cR15eBKIuorwW46ZvPknf8YqdC2HClETQcs=",
        link: "https://www.webmd.com/eye-health/why-dry-eyes"
      },
      {
        title: "Smoking & Vision Loss",
        fact: "Smoking increases risk of cataracts, macular degeneration, and optic nerve damage — all leading causes of blindness.",
        icon: <Ban size={20} className="text-emerald-400" />,
        imageUrl: "https://media.istockphoto.com/id/587213412/photo/smoking-cigarette-on-black-background.jpg?b=1&s=170667a&w=0&k=20&c=090cr9PC5tlAYFAN_O_YWgqIl1tHA6bhf22nU_PVAoU=",
        link: "https://www.cdc.gov/tobacco/campaign/tips/diseases/vision-loss-blindness.html"
      }
    ]
  },
  {
    category: "Eye Safety",
    items: [
      {
        title: "UV Protection Isn’t Just Summer",
        fact: "UV rays can damage your eyes year-round. They reflect off snow, water, and sand, increasing exposure.",
        icon: <Umbrella size={20} className="text-emerald-400" />,
        imageUrl: "https://images.unsplash.com/photo-1566421966482-ad8076104d8e?auto=format&fit=crop&w=400&h=250&q=80",
        link: "https://preventblindness.org/protect-your-eyes-from-the-sun/"
      },
      {
        title: "Contact Lens Sleep Danger",
        fact: "Sleeping in contact lenses increases your risk of eye infection by 6 to 8 times.",
        icon: <ShieldAlert size={20} className="text-emerald-400" />,
        imageUrl: "https://c8.alamy.com/comp/2H2K16G/macro-shot-of-the-contact-lens-on-the-finger-2H2K16G.jpg",
        link: "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks"
      },
      {
        title: "Makeup & Eye Infections",
        fact: "Replace eye makeup every 3 months to avoid bacterial buildup. Never share mascara or eyeliner.",
        icon: <Sparkles size={20} className="text-emerald-400" />,
        imageUrl: "https://plus.unsplash.com/premium_photo-1748218891487-e2391a723762?auto=format&fit=crop&w=400&h=250&q=80",
        link: "https://www.aoa.org/healthy-eyes/caring-for-your-eyes/eye-makeup"
      }
    ]
  },
  {
    category: "Conditions & Warning Signs",
    items: [
      {
        title: "Floaters: When to Worry",
        fact: "Most eye floaters are normal. But a sudden shower of floaters, flashes, or a curtain over vision needs immediate medical care.",
        icon: <EyeOff size={20} className="text-emerald-400" />,
        imageUrl: "https://media.istockphoto.com/id/1702186221/pt/foto/red-lens-flare-overlay-on-black-background-design-element.webp?b=1&s=170667a&w=0&k=20&c=0IlnMFxtdzz4DgbqnDcwuq_prNkhgYG2XBYZXNXYGBw=",
        link: "https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/floaters"
      },
      {
        title: "Signs You Need an Eye Exam",
        fact: "Frequent headaches, squinting, trouble seeing at night, or difficulty focusing are signs you should book an eye exam.",
        icon: <Search size={20} className="text-emerald-400" />,
        imageUrl: "https://static.vecteezy.com/system/resources/previews/067/412/592/large_2x/portrait-of-a-young-woman-squinting-and-holding-glasses-while-trying-to-see-clearly-representing-poor-vision-blurred-eyesight-or-difficulty-focusing-in-everyday-life-photo.jpg",
        link: "https://www.optometrists.org/general-practice-optometry/guide-to-eye-exams/signs-you-need-an-eye-exam/"
      },
      {
        title: "Glaucoma: The Silent Thief",
        fact: "Glaucoma often has no early symptoms. It can cause vision loss before you notice. Regular eye pressure checks after age 40 are critical.",
        icon: <Activity size={20} className="text-emerald-400" />,
        imageUrl: "https://thumbs.dreamstime.com/z/eye-care-exam-vision-test-machine-patient-doctor-optometry-consultation-lens-frame-hands-man-healthcare-268727858.jpg",
        link: "https://glaucoma.org/glaucoma-facts-and-stats/"
      }
    ]
  },
  {
    category: "Myths & General Knowledge",
    items: [
      {
        title: "Carrots Improve Night Vision?",
        fact: "Carrots are rich in vitamin A, which helps prevent night blindness. But they won’t improve vision if you’re not deficient.",
        icon: <Lightbulb size={20} className="text-emerald-400" />,
        imageUrl: "https://thumbs.dreamstime.com/z/pile-fresh-ripe-carrots-field-organic-farming-158287747.jpg",
        link: "https://www.scientificamerican.com/article/fact-or-fiction-carrots-improve-your-vision/"
      },
      {
        title: "Reading in Dim Light Damages Eyes",
        fact: "Reading in low light won’t damage your eyes permanently, but it can cause eye strain and temporary fatigue.",
        icon: <BookOpen size={20} className="text-emerald-400" />,
        imageUrl: "https://png.pngtree.com/background/20230517/original/pngtree-girl-reads-a-book-under-the-lamp-picture-image_2637388.jpg",
        link: "https://www.aao.org/eye-health/tips-prevention/eye-myths"
      }
    ]
  }
];

export default function EyeFacts() {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-10 text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-onSurface tracking-tight">
          {t('eyeFacts.eyeCatching')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t('eyeFacts.facts')}</span>
        </h1>
        <p className="text-onSurfaceVariant text-lg max-w-2xl mx-auto">
          {t('eyeFacts.exploreKnowledge')}
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-16">
        {factsData.map((section, sectionIdx) => (
          <section key={sectionIdx}>
            <h2 className="text-2xl font-bold text-onSurface mb-6 pb-2 border-b border-outlineVariant/30">
              {section.category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, itemIdx) => (
                <motion.div 
                  key={itemIdx}
                  className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:border-emerald-500/50 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: itemIdx * 0.1, duration: 0.5 }}
                >
                  <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors duration-300 shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-white text-lg font-semibold leading-tight mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-slate-300 text-sm flex-grow leading-relaxed">
                      {item.fact}
                    </p>
                    
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium text-sm mt-6 transition-colors"
                    >
                      {t('eyeFacts.readMore')} 
                      <span className="transform transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
