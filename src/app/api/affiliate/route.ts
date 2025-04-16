import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const persona = req.nextUrl.searchParams.get('persona');

  if (!persona) {
    return NextResponse.json([]);
  }

  let offers = [];

  switch (persona) {
    case 'foodie':
      offers = [
        { id: '1', name: 'Wine Tasting Tour', description: 'Enjoy a guided tour of local vineyards.', link: '#' },
        { id: '2', name: 'Cooking Class', description: 'Learn to cook traditional Sardinian dishes.', link: '#' },
      ];
      break;
    case 'adventurer':
      offers = [
        { id: '3', name: 'Hiking Excursion', description: 'Explore the rugged terrain of Sardinia.', link: '#' },
        { id: '4', name: 'Boat Trip', description: 'Discover hidden coves and beaches.', link: '#' },
      ];
      break;
    case 'relaxer':
      offers = [
        { id: '5', name: 'Spa Day', description: 'Indulge in a relaxing spa experience.', link: '#' },
        { id: '6', name: 'Beach Retreat', description: 'Unwind on the beautiful beaches of Sardinia.', link: '#' },
      ];
      break;
  }

  return NextResponse.json(offers);
}