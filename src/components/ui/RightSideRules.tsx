
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// export default function RightSideRules() {
//     const rules = [
//         {
//             title: "No memes, screenshots, and jokes",
//             content: "Keep content professional and relevant to web development."
//         },
//         {
//             title: "No self-promotion",
//             content: "Avoid promoting personal projects or services outside of designated threads."
//         },
//         {
//             title: "No commercial promotions/solicitations",
//             content: "This community is for learning and discussion, not advertising."
//         },
//         {
//             title: "No soliciting feedback not on Saturday",
//             content: "Save project feedback requests for Showoff Saturdays."
//         },
//         {
//             title: "Assistance Questions Guidelines",
//             content: "Follow community guidelines when asking for help. Provide code samples and describe what you've tried."
//         },
//         {
//             title: "Career/Getting Started Questions",
//             content: "Use the appropriate threads for career advice and getting started in web development."
//         }
//     ]

//     return (
//         <div className="space-y-4">
//             <Card className="bg-gray-100 dark:bg-gray-800">
//                 <CardHeader>
//                     <CardTitle className="text-lg font-bold">RULES</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <Accordion type="single" collapsible className="w-full">
//                         {rules.map((rule, index) => (
//                             <AccordionItem key={index} value={`item-${index}`}>
//                                 <AccordionTrigger className="text-sm font-medium">
//                                     {index + 1}. {rule.title}
//                                 </AccordionTrigger>
//                                 <AccordionContent className="text-sm">
//                                     {rule.content}
//                                 </AccordionContent>
//                             </AccordionItem>
//                         ))}
//                     </Accordion>
//                 </CardContent>
//             </Card>

//             <Card className="bg-gray-100 dark:bg-gray-800">
//                 <CardHeader>
//                     <CardTitle className="text-lg font-bold">SHOWOFF SATURDAYS</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-sm">
//                     <p className="mb-2">
//                         Work on something and want to share it? Showoff Saturdays are for you! Make a new post on Saturday and tag it [Showoff Saturday] and watch the views rise.
//                     </p>
//                     <p>
//                         Sharing your project, portfolio, or any other content that you want to either show off or request feedback on is limited to Showoff Saturdays. If you post such content on any other day, it will be removed.
//                     </p>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }


const RightSideRules = () => {
    return (
        <Card className="mb-4 bg-gray-100 dark:bg-black dark:bg-opacity-50">
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