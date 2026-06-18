import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-green-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <span className="align-middle">
            &copy; {new Date().getFullYear()} The Library
          </span>
        </div>
       
       <div>
        <span className="align-middle font-black text-lg">
            Contact Details
        </span>
        <br/>
         <span className="size-sm font-normal">
        51 Nangla Tashi 
        <br/>
        Kanker Khera Meerut, Uttar Pradesh 250001
        <br/>
        Phone: +91 9911272124
        <br/>
        Email: info@thelibrary.com
        </span>
          
       </div>
      </div>
    </footer>
  );
}