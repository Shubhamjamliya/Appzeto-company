import React from 'react';
import ServiceSection from '../../../components/common/ServiceSection';
import homeWiring from '../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/home-wiring.jpg';
import switchSocket from '../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/switch&socket.jpg';
import fan from '../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/fan.jpg';

const InstallationSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Home Wiring Installation',
      rating: '4.83',
      reviews: '320K',
      price: '1,499',
      duration: '4 hrs',
      features: [
        'Complete home wiring installation',
        'Safety compliance and certification',
      ],
      image: homeWiring,
    },
    {
      id: 2,
      title: 'Switch & Socket Installation',
      rating: '4.81',
      reviews: '280K',
      price: '399',
      duration: '2 hrs',
      features: [
        'Switch and socket installation',
        'Multiple point installation available',
      ],
      image: switchSocket,
    },
    {
      id: 3,
      title: 'Fan & Light Installation',
      rating: '4.84',
      reviews: '450K',
      price: '299',
      duration: '1 hr 30 mins',
      features: [
        'Ceiling fan and light installation',
        'Safe and professional installation',
      ],
      image: fan,
    },
  ];

  return (
    <ServiceSection
      title="Installation"
      services={services}
      onAddClick={onAddClick}
      onViewDetails={onViewDetails}
    />
  );
};

export default InstallationSection;

