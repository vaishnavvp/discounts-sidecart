import DiscountsPanel from '@/components/DiscountsPanel';
import OverviewCard from '@/components/OverviewCard';

export default function App() {
  return (
   <div className="mx-auto max-w-6xl p-8">
      {/* Top-left button */}
      <div className="mb-6">
        <button
          onClick={() => console.log("Top button clicked")}
          className="bg-[#767676] px-4 py-2 text-[#FFFFFF] text-xm font-[14px]"
        >
          Previous
        </button>
      </div>

      {/* Main content grid */}
      <main className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 items-start">
        <DiscountsPanel />
        <div className="md:sticky md:top-6">
          <OverviewCard />
        </div>
      </main>
    </div>

  );
}
