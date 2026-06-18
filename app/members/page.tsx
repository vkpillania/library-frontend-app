
import MembersTable from "./components/memberTable";

export default  async function Members() {
  const response = await fetch("http://0.0.0.0:8000/api/v1/members/" , { cache: "no-store" });
  const data =  await response.json();
  const members = data.results;
  console.log(members);
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
     
        <div className="flex flex-col items-center  text-center sm:items-start sm:text-left">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Members List
            </h1>
            <div className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                    
            </div>
          <MembersTable members={members} />
          
        </div>
        
      </main>
    </div>
  );
}