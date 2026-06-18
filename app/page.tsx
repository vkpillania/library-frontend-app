export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
     
        <div className="flex flex-col items-center  text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to The Neighorhood Library!
          </h1>
          <div className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            We are a community-driven library dedicated to providing access to a wide range of books and resources for all ages. Our mission is to foster a love for reading and learning while creating a welcoming space for everyone in our neighborhood.
          </div>
          
        </div>
        
      </main>
    </div>
  );
}
