import React from 'react';
import ServiceSection from '../../../components/common/ServiceSection';
import homeWiring from '../../../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/home-wiring.jpg';
import electricalPanel from '../../../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/electrical-panel-upgrade.jpg';
import switchSocket from '../../../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/switch&socket.jpg';

const ElectricalRepairSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Home Wiring Repair',
      rating: '4.85',
      reviews: '250K',
      price: '599',
      duration: '2 hrs',
      badge: 'BESTSELLER',
      features: [
        'Complete wiring diagnosis and repair',
        'Safe and certified electricians',
      ],
      image: homeWiring,
    },
    {
      id: 2,
      title: 'Electrical Panel Upgrade',
      rating: '4.82',
      reviews: '180K',
      price: '1,299',
      duration: '3 hrs',
      features: [
        'Panel upgrade and safety checks',
        'MCB and RCCB installation',
      ],
      image: electricalPanel,
    },
    {
      id: 3,
      title: 'Switch & Socket Repair',
      rating: '4.80',
      reviews: '150K',
      price: '299',
      duration: '1 hr',
      features: [
        'Switch and socket replacement',
        'Fault diagnosis and repair',
      ],
      image: switchSocket,
    },
  ];

  return (
    <ServiceSection
      title="Electrical Repair"
      services={services}
      onAddClick={onAddClick}
      onViewDetails={onViewDetails}
    />
  );
};

export default ElectricalRepairSection;
