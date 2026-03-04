import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <Image height={130} width={180} alt="logo" src="/Logo.png" />
    </Link>
  );
};
