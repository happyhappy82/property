import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { getSortedPropertiesData } from "@/lib/properties";

export default function Home() {
  const properties = getSortedPropertiesData();

  return (
    <>
      <Header />
      <main>
        <div className="relative -top-[10px] flex flex-col gap-8">
          {properties.length === 0 ? (
            <p>No properties yet. Create your first property in content/properties/</p>
          ) : (
            properties.map((property) => (
              <PropertyCard key={property.slug} {...property} />
            ))
          )}
        </div>
      </main>
    </>
  );
}
