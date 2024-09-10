import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserAvatar = ({ name, image, size = 7 }: { name: string | undefined | null, image: string | undefined | null, size?: number }) => {
    return (
        <Avatar className={`size-${size}`}>
            {
                !image ? 
                    <AvatarImage src={`https://api.dicebear.com/9.x/micah/svg?seed=${name![0]}`} />
                    :
                    <AvatarImage src={image} />
            }
            <AvatarFallback>{name![0]}</AvatarFallback>
        </Avatar>

    )
}

export default UserAvatar

