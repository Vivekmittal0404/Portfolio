import MessageManager from "@/components/admin/MessageManager";
import PageHeading from "@/components/admin/PageHeading";
import { getMessageRows } from "@/lib/admin-data";

export const metadata = {
  title: "Messages | Portfolio Admin",
  robots: { index: false, follow: false },
};

export default async function MessagesPage() {
  const messages = await getMessageRows();
  return (
    <>
      <PageHeading
        eyebrow="Inbox"
        title="Messages"
        description={`${messages.filter((message) => !message.isRead).length} unread · ${messages.length} shown`}
      />
      <MessageManager initialMessages={messages} />
    </>
  );
}
