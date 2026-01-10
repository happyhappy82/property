import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="mb-14 flex flex-row place-content-between">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-block"
        >
          <Image
            src="/logo.png"
            alt="부동산 트렌드 리뷰"
            width={200}
            height={50}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
