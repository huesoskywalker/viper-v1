export const metadata = {
  title: 'viper',
  description: 'The best application to find events and schedule your week with fun',
};

export default async function HomePage() {
  return (
    <div className="max-w-screen-md mx-auto  space-y-8 mt-7 lg:px-8 sm:px-6">
      <h2 data-test-id="authenticated" className="text-xl font-medium text-gray-300 text-center">
        Welcome to the best app in the world
      </h2>
      <p className="text-gray-400 text-center">
        Find & organize Events, match people, have fun and enjoy
      </p>
    </div>
  );
}
