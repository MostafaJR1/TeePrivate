import Link from "next/link";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { getGlobalProducts, DatabaseProduct } from "@/utils/supabase/products";
import { CatalogFilters } from "@/Components/LandingPage/CatalogHero";
import { ProductCard } from "@/Components/LandingPage/ProductCard"; // Import our new Client-Side Card [1.1.2]

const ITEMS_PER_PAGE = 8;

interface PageProps {
  searchParams: Promise<{ 
    category?: string; 
    gender?: string; 
    search?: string; 
    page?: string; 
  }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const activeCategory = params.category || "All";
  const activeGender = params.gender || "All";
  const searchQuery = params.search || "";
  const currentPage = Number(params.page) || 1;

  // 1. Fetch products from the global shared cache (0 DB queries) [1.1.2, 1.2.6]
  const allProducts: DatabaseProduct[] = await getGlobalProducts();

  // 2. Filter products on the server [1.1.9]
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = searchQuery === "" || product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 3. Paginate products on the server [1.1.9, 2]
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-[#0d0d0f] flex flex-col relative text-white">
      
      {/* 1. WORKSPACE HEADER */}
      <CatalogFilters 
        initialCategory={activeCategory}
        initialSearch={searchQuery}
        initialGender={activeGender}
      />

      {/* 2. PRODUCT CATALOG GRID AREA */}
      <section className="bg-[#0d0d0f] p-6 md:p-10 pb-24 text-white flex flex-col gap-10">
        
        {/* Title bar */}
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <span className="text-[10px] font-black text-[#e9204f] tracking-widest uppercase mb-1 block">TEEPRIVATE ORIGINALS</span>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">Signature Apparel Collection</h2>
          </div>
          <span className="text-xs font-bold text-neutral-500">{totalItems} products listed</span>
        </div>

        {/* 4-IN-A-ROW COMPACT PRODUCT GRID (Using our new modular card) [1] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* C. PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-white/5">
            {/* Back Arrow */}
            <Link
              href={currentPage === 1 ? "#" : `/u/catalog?page=${currentPage - 1}&category=${activeCategory}&search=${searchQuery}`}
              className={`w-10 h-10 border border-white/10 flex items-center justify-center rounded-none transition duration-150 ${
                currentPage === 1 
                  ? "opacity-30 pointer-events-none cursor-not-allowed" 
                  : "hover:bg-white/5 hover:border-white/20"
              }`}
            >
              <IoChevronBack size={16} />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={`/u/catalog?page=${pageNum}&category=${activeCategory}&search=${searchQuery}`}
                    className={`w-10 h-10 flex items-center justify-center font-black text-xs transition duration-150 rounded-none ${
                      isCurrent 
                        ? "primary-bg text-white shadow-md" 
                        : "border border-white/10 text-neutral-400 hover:bg-white/5"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            {/* Next Arrow */}
            <Link
              href={currentPage === totalPages ? "#" : `/u/catalog?page=${currentPage + 1}&category=${activeCategory}&search=${searchQuery}`}
              className={`w-10 h-10 border border-white/10 flex items-center justify-center rounded-none transition duration-150 ${
                currentPage === totalPages 
                  ? "opacity-30 pointer-events-none cursor-not-allowed" 
                  : "hover:bg-white/5 hover:border-white/20"
              }`}
            >
              <IoChevronForward size={16} />
            </Link>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-20 text-neutral-500 text-[10px] font-black uppercase tracking-widest border border-dashed border-white/5 rounded-none">
            No products found matching your search
          </div>
        )}

      </section>
    </div>
  );
}