import React from 'react';
import ServiceCard from '../../../components/common/ServiceCard';

const CuratedServices = ({ services, onServiceClick }) => {
  // Default electrical services if none provided
  const defaultServices = [
    {
      id: 1,
      title: 'Bathroom Deep Cleaning',
      gif: null,
      youtubeUrl: 'https://youtube.com/shorts/Sk9Rb57RoTA?si=4XyV0WBgHkadcYIC', // Replace with actual YouTube link
    },

    {
      id: 2,
      title: 'SPA for WOMEN',
      gif: null,
      youtubeUrl: 'https://youtube.com/shorts/-si75xtzHm0?si=YJja3ZqDEu6IZP0Y', // Replace with actual YouTube link
    },
    {
      id: 3,
      title: 'Massage for Men',
      gif: null,
      youtubeUrl: 'https://youtube.com/shorts/Sk9Rb57RoTA?si=4XyV0WBgHkadcYIC', // Replace with actual YouTube link
    },
    {
      id: 4,
      title: 'Roll-on waxing',
      gif: null,
      youtubeUrl: 'https://youtube.com/shorts/Sk9Rb57RoTA?si=4XyV0WBgHkadcYIC', // Replace with actual YouTube link
    },
    {
      id: 5,
      title: 'FACIALS & CLEANUPS',
      gif: null,
      youtubeUrl: 'https://youtube.com/shorts/Sk9Rb57RoTA?si=4XyV0WBgHkadcYIC', // Replace with actual YouTube link
    },
    {
      id: 6,
      title: 'Professional Sofa Cleaning',
      gif: null,
      youtubeUrl: 'https://youtube.com/shorts/Sk9Rb57RoTA?si=4XyV0WBgHkadcYIC', // Replace with actual YouTube link
    },
  ];

  const serviceList = services || defaultServices;

  return (
    <div className="mb-6">
      {/* Title Section */}
      <div className="px-4 mb-5">
        <h2 
          className="text-xl font-bold mb-1 text-black"
        >
          Thoughtful curations
        </h2>
        <p className="text-sm font-medium text-black">
          of our finest experiences
        </p>
      </div>

      {/* Horizontal Scrollable Service Cards */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {serviceList.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            gif={service.gif}
            youtubeUrl={service.youtubeUrl}
            onClick={() => onServiceClick?.(service)}
          />
        ))}
      </div>
    </div>
  );
};

export default CuratedServices;

