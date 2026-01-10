import Link from 'next/link';

export default function Header() {
  return (
    <header className="mb-14 flex flex-row place-content-between">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-block"
        >
          <h1 className="text-3xl font-black text-blue-600">부동산 트렌드 리뷰</h1>
        </Link>
      </div>
    </header>
  );
}
