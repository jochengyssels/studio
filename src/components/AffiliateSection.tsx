import { useState, useEffect } from 'react';

interface AffiliateOffer {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface AffiliateSectionProps {
  persona: string;
}

const AffiliateSection: React.FC<AffiliateSectionProps> = ({ persona }) => {
  const [offers, setOffers] = useState<AffiliateOffer[]>([]);

  useEffect(() => {
    if (persona) {
      fetch(`/api/affiliate?persona=${persona}`)
        .then(res => res.json())
        .then(data => setOffers(data))
        .catch(error => console.error('Error fetching affiliate offers:', error));
    }
  }, [persona]);

  return (
    <div>
      {offers.length > 0 ? (
        offers.map(offer => (
          <a href={offer.link} target="_blank" key={offer.id} className="block mb-4 p-4 border rounded-md hover:bg-gray-100">
            <h4 className="text-lg font-semibold">{offer.name}</h4>
            <p className="text-sm">{offer.description}</p>
          </a>
        ))
      ) : (
        <p>No offers available for this persona.</p>
      )}
    </div>
  );
};

export default AffiliateSection;