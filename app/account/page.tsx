import AccountClient from "./AccountClient";

export const metadata = {
  title: "내 계정 | 스톡리포트",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AccountPage() {
  return <AccountClient />;
}
