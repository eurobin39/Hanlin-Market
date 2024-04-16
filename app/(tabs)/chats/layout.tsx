
import ChatTypeButton from '@/components/chat-type-button';


export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            <ChatTypeButton />
            <main>{children}</main>
        </>
    )
}
