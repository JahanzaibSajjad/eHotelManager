import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Adjust this path to your Firebase configuration file

const rooms = [
  {
    name: "Standard Room",
    capacity: 2,
    price: 100,
    description: "A cozy room with basic amenities.",
    amenities: ["Wi-Fi", "TV", "Air Conditioning"],
    status: "Available",
  },
  {
    name: "Deluxe Room",
    capacity: 4,
    price: 180,
    description: "Spacious room with premium amenities.",
    amenities: ["Wi-Fi", "TV", "Coffee Maker", "Room Service"],
    status: "Available",
  },
  {
    name: "Suite",
    capacity: 6,
    price: 300,
    description: "Luxury suite with exclusive features.",
    amenities: ["Wi-Fi", "TV", "Jacuzzi", "Mini Bar", "Room Service"],
    status: "Available",
  },
  {
    name: "Family Room",
    capacity: 5,
    price: 250,
    description: "A comfortable room perfect for families.",
    amenities: ["Wi-Fi", "TV", "Play Area", "Mini Fridge"],
    status: "Available",
  },
  {
    name: "Single Room",
    capacity: 1,
    price: 70,
    description: "Perfect for solo travelers.",
    amenities: ["Wi-Fi", "TV"],
    status: "Available",
  },
  {
    name: "Presidential Suite",
    capacity: 8,
    price: 500,
    description: "Exclusive suite for a premium stay.",
    amenities: ["Wi-Fi", "TV", "Private Pool", "Jacuzzi", "Butler Service"],
    status: "Available",
  },
  {
    name: "Economy Room",
    capacity: 2,
    price: 80,
    description: "Budget-friendly room with basic facilities.",
    amenities: ["Wi-Fi", "TV"],
    status: "Available",
  },
  {
    name: "Executive Room",
    capacity: 3,
    price: 220,
    description: "For business travelers with extra perks.",
    amenities: ["Wi-Fi", "TV", "Work Desk", "Mini Fridge"],
    status: "Available",
  },
  {
    name: "Luxury Suite",
    capacity: 6,
    price: 400,
    description: "High-end suite with luxurious features.",
    amenities: ["Wi-Fi", "TV", "Private Lounge", "Jacuzzi", "Mini Bar"],
    status: "Available",
  },
  {
    name: "Couple's Retreat",
    capacity: 2,
    price: 150,
    description: "A romantic getaway for couples.",
    amenities: ["Wi-Fi", "TV", "Balcony View", "Mini Fridge"],
    status: "Available",
  },
  {
    name: "Penthouse Suite",
    capacity: 10,
    price: 700,
    description: "Top-floor suite with an amazing city view.",
    amenities: ["Wi-Fi", "TV", "Private Terrace", "Mini Bar"],
    status: "Available",
  },
  {
    name: "Beachside Room",
    capacity: 3,
    price: 180,
    description: "Room with an amazing beach view.",
    amenities: ["Wi-Fi", "TV", "Balcony", "Mini Fridge"],
    status: "Available",
  },
  {
    name: "Mountain View Room",
    capacity: 4,
    price: 200,
    description: "Relax with a stunning mountain view.",
    amenities: ["Wi-Fi", "TV", "Balcony", "Mini Bar"],
    status: "Available",
  },
  {
    name: "Garden Suite",
    capacity: 5,
    price: 350,
    description: "Surrounded by lush gardens for a serene experience.",
    amenities: ["Wi-Fi", "TV", "Private Garden", "Room Service"],
    status: "Available",
  },
  {
    name: "Loft Room",
    capacity: 2,
    price: 120,
    description: "Stylish loft room for a unique stay.",
    amenities: ["Wi-Fi", "TV", "Mini Fridge"],
    status: "Available",
  },
  {
    name: "Cabana",
    capacity: 3,
    price: 140,
    description: "Private cabana by the pool.",
    amenities: ["Wi-Fi", "TV", "Pool Access"],
    status: "Available",
  },
  {
    name: "Honeymoon Suite",
    capacity: 2,
    price: 350,
    description: "Perfect for newlyweds.",
    amenities: ["Wi-Fi", "TV", "Jacuzzi", "Balcony View"],
    status: "Available",
  },
  {
    name: "Heritage Room",
    capacity: 4,
    price: 220,
    description: "Experience a touch of history.",
    amenities: ["Wi-Fi", "TV", "Vintage Decor"],
    status: "Available",
  },
  {
    name: "Boutique Room",
    capacity: 3,
    price: 200,
    description: "Individually styled boutique rooms.",
    amenities: ["Wi-Fi", "TV", "Mini Fridge"],
    status: "Available",
  },
  {
    name: "Spa Suite",
    capacity: 4,
    price: 450,
    description: "A suite with spa-like amenities.",
    amenities: ["Wi-Fi", "TV", "Spa Access", "Jacuzzi"],
    status: "Available",
  },
  {
    name: "Adventure Cabin",
    capacity: 2,
    price: 160,
    description: "For adventure lovers.",
    amenities: ["Wi-Fi", "TV", "Outdoor Activities"],
    status: "Available",
  },
  {
    name: "Pool View Room",
    capacity: 3,
    price: 180,
    description: "Room overlooking the pool area.",
    amenities: ["Wi-Fi", "TV", "Balcony", "Mini Bar"],
    status: "Available",
  },
  {
    name: "Terrace Suite",
    capacity: 4,
    price: 300,
    description: "Suite with a large private terrace.",
    amenities: ["Wi-Fi", "TV", "Terrace Access", "Mini Fridge"],
    status: "Available",
  },
  {
    name: "Lake View Room",
    capacity: 3,
    price: 190,
    description: "Room with a peaceful lake view.",
    amenities: ["Wi-Fi", "TV", "Balcony", "Mini Bar"],
    status: "Available",
  },
  {
    name: "Dormitory",
    capacity: 6,
    price: 60,
    description: "Shared dormitory for budget travelers.",
    amenities: ["Wi-Fi", "Shared TV"],
    status: "Available",
  },
  {
    name: "Eco Room",
    capacity: 2,
    price: 120,
    description: "Eco-friendly room for sustainable travelers.",
    amenities: ["Wi-Fi", "TV", "Eco Toiletries"],
    status: "Available",
  },
  {
    name: "Business Room",
    capacity: 2,
    price: 200,
    description: "Room designed for business travelers.",
    amenities: ["Wi-Fi", "TV", "Work Desk"],
    status: "Available",
  },
  {
    name: "Luxury Cottage",
    capacity: 5,
    price: 400,
    description: "A private luxury cottage.",
    amenities: ["Wi-Fi", "TV", "Private Garden"],
    status: "Available",
  },
  {
    name: "Studio Apartment",
    capacity: 3,
    price: 250,
    description: "Fully equipped studio apartment.",
    amenities: ["Wi-Fi", "TV", "Kitchen"],
    status: "Available",
  },
  {
    name: "Skyline Suite",
    capacity: 8,
    price: 600,
    description: "Panoramic views of the city skyline.",
    amenities: ["Wi-Fi", "TV", "Private Lounge", "Mini Bar"],
    status: "Available",
  },
];

export const addRoomsToFirestore = async () => {
  try {
    const roomsCollection = collection(db, "rooms");

    // Use forEach or map to iterate over the rooms array and add each room
    await Promise.all(
      rooms.map(async (room) => {
        await addDoc(roomsCollection, room);
      })
    );
  } catch (error) {
    console.error("Error adding rooms:", error);
  }
};
