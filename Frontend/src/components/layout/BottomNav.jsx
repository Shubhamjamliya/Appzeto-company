import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiGift, FiShoppingCart, FiUser } from 'react-icons/fi';
import { HiHome, HiGift, HiShoppingCart, HiUser } from 'react-icons/hi';
import { gsap } from 'gsap';

const BottomNav = ({ cartCount, onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const iconRefs = useRef({});
  const activeAnimations = useRef({});
  const [iconTransitions, setIconTransitions] = React.useState({});

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      Object.values(activeAnimations.current).forEach(anim => {
        if (anim && anim.isActive()) {
          // Don't kill if still active, let it complete
        }
      });
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Appzeto', icon: FiHome, filledIcon: HiHome, path: '/' },
    { id: 'rewards', label: 'Rewards', icon: FiGift, filledIcon: HiGift, path: '/rewards' },
    { id: 'cart', label: 'Cart', icon: FiShoppingCart, filledIcon: HiShoppingCart, path: '/cart', isCart: true },
    { id: 'account', label: 'Account', icon: FiUser, filledIcon: HiUser, path: '/account' },
  ];

  const getActiveTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/rewards') return 'rewards';
    if (location.pathname === '/cart') return 'cart';
    if (location.pathname === '/account') return 'account';
    return 'home';
  };

  const activeTab = getActiveTab();

  // Smooth icon transition when active state changes - slow fade
  useEffect(() => {
    navItems.forEach((item) => {
      const isActive = activeTab === item.id;
      setIconTransitions(prev => ({
        ...prev,
        [item.id]: { isActive, opacity: 0 }
      }));
      
      // Slow fade in new icon
      setTimeout(() => {
        setIconTransitions(prev => ({
          ...prev,
          [item.id]: { isActive, opacity: 1 }
        }));
      }, 200);
    });
  }, [activeTab]);

  const handleTabClick = (path, itemId) => {
    // Animate icon on click - get ref immediately
    const iconRef = iconRefs.current[itemId];
    
    if (iconRef) {
      // Different animations for different icons
      let animation;
      switch (itemId) {
        case 'rewards':
          // Gift opening animation - scale and rotate - make it more visible
          gsap.killTweensOf(iconRef);
          // Reset to initial state first
          gsap.set(iconRef, { scale: 1, rotation: 0, x: 0, y: 0 });
          // Start animation immediately
          // Create timeline for better control over exit animation
          const tl = gsap.timeline({
            onStart: () => {
              iconRef.style.willChange = 'transform';
            },
            onComplete: () => {
              gsap.set(iconRef, { scale: 1, rotation: 0 });
              iconRef.style.willChange = 'auto';
              delete activeAnimations.current[itemId];
            }
          });
          
          // Forward animation - fast
          tl.to(iconRef, {
            scale: 1.5,
            rotation: 25,
            duration: 1.0,
            ease: 'power2.out',
          })
          // Exit animation - slow
          .to(iconRef, {
            scale: 1,
            rotation: 0,
            duration: 2.0,
            ease: 'power1.inOut',
          });
          
          animation = tl;
          activeAnimations.current[itemId] = animation;
          
          // Delay navigation significantly to let animation be visible and continue
          setTimeout(() => {
            navigate(path);
          }, 800);
          return; // Return early to prevent double navigation
          break;
        case 'cart':
          // Cart moving animation - translate X - slow and visible
          gsap.killTweensOf(iconRef);
          gsap.set(iconRef, { scale: 1, rotation: 0, x: 0, y: 0 });
          animation = gsap.to(iconRef, {
            x: 8,
            duration: 0.5,
            yoyo: true,
            repeat: 2,
            ease: 'power1.inOut',
            onStart: () => {
              iconRef.style.willChange = 'transform';
            },
            onComplete: () => {
              gsap.set(iconRef, { x: 0 });
              iconRef.style.willChange = 'auto';
              delete activeAnimations.current[itemId];
            }
          });
          activeAnimations.current[itemId] = animation;
          
          // Delay navigation to let animation be visible
          setTimeout(() => {
            navigate(path);
          }, 600);
          return;
          break;
        case 'account':
          // Pulse animation - slow and visible
          gsap.killTweensOf(iconRef);
          gsap.set(iconRef, { scale: 1, rotation: 0, x: 0, y: 0 });
          animation = gsap.to(iconRef, {
            scale: 1.3,
            duration: 1.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
            onStart: () => {
              iconRef.style.willChange = 'transform';
            },
            onComplete: () => {
              gsap.set(iconRef, { scale: 1 });
              iconRef.style.willChange = 'auto';
              delete activeAnimations.current[itemId];
            }
          });
          activeAnimations.current[itemId] = animation;
          
          // Delay navigation to let animation be visible
          setTimeout(() => {
            navigate(path);
          }, 800);
          return;
          break;
        case 'home':
          // Bounce animation - slow and visible
          gsap.killTweensOf(iconRef);
          gsap.set(iconRef, { scale: 1, rotation: 0, x: 0, y: 0 });
          animation = gsap.to(iconRef, {
            y: -10,
            duration: 1.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
            onStart: () => {
              iconRef.style.willChange = 'transform';
            },
            onComplete: () => {
              gsap.set(iconRef, { y: 0 });
              iconRef.style.willChange = 'auto';
              delete activeAnimations.current[itemId];
            }
          });
          activeAnimations.current[itemId] = animation;
          
          // Delay navigation to let animation be visible
          setTimeout(() => {
            navigate(path);
          }, 800);
          return;
          break;
        default:
          // Default scale animation
          gsap.killTweensOf(iconRef);
          gsap.set(iconRef, { scale: 1, rotation: 0, x: 0, y: 0 });
          animation = gsap.to(iconRef, {
            scale: 1.2,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(iconRef, { scale: 1 });
              delete activeAnimations.current[itemId];
            }
          });
          activeAnimations.current[itemId] = animation;
      }
    }
    
    // Default navigation (should not reach here for rewards, cart, account, home)
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 safe-area-bottom" style={{ borderTop: '2px solid #9ca3af' }}>
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const IconComponent = activeTab === item.id ? item.filledIcon : item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                handleTabClick(item.path, item.id);
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors relative ${
                isActive ? '' : 'text-gray-500'
              }`}
              style={isActive ? { color: '#00a6a6' } : {}}
            >
              {item.isCart ? (
                <div 
                  ref={(el) => {
                    if (el) {
                      iconRefs.current[item.id] = el;
                    }
                  }}
                  className="relative"
                  style={{ transform: 'translateX(0) translateY(0) scale(1) rotate(0deg)' }}
                >
                  <IconComponent 
                    className="w-5 h-5"
                    style={{ 
                      color: isActive ? '#00a6a6' : '#6b7280',
                      transition: 'opacity 2s ease-in-out, color 2s ease-in-out',
                      transform: 'scale(1)',
                      opacity: iconTransitions[item.id]?.opacity !== undefined ? iconTransitions[item.id].opacity : 1
                    }}
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 z-10">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
              ) : (
                <div
                  ref={(el) => {
                    if (el) {
                      iconRefs.current[item.id] = el;
                    }
                  }}
                  style={{ transform: 'translateX(0) translateY(0) scale(1) rotate(0deg)' }}
                >
                  <IconComponent 
                    className="w-5 h-5"
                    style={{ 
                      color: isActive ? '#00a6a6' : '#6b7280',
                      transition: 'opacity 2s ease-in-out, color 2s ease-in-out',
                      transform: 'scale(1)',
                      opacity: iconTransitions[item.id]?.opacity !== undefined ? iconTransitions[item.id].opacity : 1
                    }}
                  />
                </div>
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

