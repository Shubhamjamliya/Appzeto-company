import React from 'react';
import ServiceSection from '../../../components/common/ServiceSection';
import smartHomeSetup from '../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/smart home setup.jpg';
import doorbell from '../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/dorebell.jpg';

const SmartHomeSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Smart Home Setup',
      rating: '4.86',
      reviews: '95K',
      price: '2,499',
      duration: '5 hrs',
      badge: 'POPULAR',
      features: [
        'Complete smart home automation setup',
        'Smart switches, lights, and sensors',
      ],
      image: smartHomeSetup,
    },
    {
      id: 2,
      title: 'Smart Switch Installation',
      rating: '4.84',
      reviews: '120K',
      price: '799',
      duration: '2 hrs',
      features: [
        'Smart switch installation and setup',
        'App control and voice integration',
      ],
      image: smartHomeSetup,
    },
    {
      id: 3,
      title: 'Smart Doorbell Installation',
      rating: '4.82',
      reviews: '85K',
      price: '599',
      duration: '1 hr 30 mins',
      features: [
        'Smart doorbell installation',
        'Video doorbell with app connectivity',
      ],
      image: doorbell,
    },
  ];

  return (
    <ServiceSection
      title="Smart Home"
      services={services}
      onAddClick={onAddClick}
      onViewDetails={onViewDetails}
    />
  );
};

export default SmartHomeSection;

