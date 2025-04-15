import HeroBanner from '../components/HeroBanner';

const Home = () => {
  return (
    <div>
      <HeroBanner />
      <div className="container mx-auto mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">¡Bienvenido a tu tienda online!</h2>
        <p className="text-gray-600">Explora nuestros productos y encuentra lo que necesitas.</p>
      </div>
    </div>
  );
};

export default Home;
