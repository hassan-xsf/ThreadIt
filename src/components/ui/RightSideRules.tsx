
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const RightSideRules = () => {
    return (
        <Card className="mb-4 bg-gray-100 dark:bg-zinc-950">
            <CardHeader>
                <CardTitle className="text-lg">R/WEBDEV RULES</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-decimal pl-4 text-sm">
                    <li>Keep discussions relevant to the community's focus.</li>
                    <li>Respect everyone's opinions, even if you disagree.</li>
                    <li>Provide context when asking for help to get better responses.</li>
                    <li>Keep personal information private—no sharing passwords or sensitive details.</li>
                </ul>
            </CardContent>
        </Card>
    )
}

export default RightSideRules