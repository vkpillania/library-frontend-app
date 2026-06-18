import BooksTable from "../components/booksTable";
import { apiCall } from "../../lib/api";
import Link from "next/link";
export default async function Books() {
  const response = await apiCall("/books" , { cache: "no-store" });
  console.log("response", response);
  if (!response.ok) {
    console.log("Failed to fetch books");
  }
  let isAuthenticated = true;
  if (response.status === 401) {
    isAuthenticated = false;
  }
  
  const data =  await response.json();
  const books = data.results;
  console.log(books);
  console.log("data", data);
  console.log(books); 

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
         <div className="flex flex-col items-center  text-center sm:items-start sm:text-left">
   
        <div className="flex flex-col items-center  text-center sm:items-start sm:text-left">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Welcome to the Books Catalog 
            </h1>
            <div className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                    
            </div>
               <Link href="/books/add-book" className="bg-green-600 text-white  font-medium px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                     + Add Book
                </Link>
            </div>
            { isAuthenticated ? <div></div> 
            : <div>Not authorized</div>} 
          <BooksTable books={books} />
          
        </div>
      </main>
    </div>
  );
}