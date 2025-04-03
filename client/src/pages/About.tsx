import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Info, Award, Leaf, MapPin } from "lucide-react";

const About = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About the Ranking System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              ELO Rating System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700">
              Our ranking system uses the ELO rating algorithm, originally developed for chess rankings. Each park starts with 1500 points and gains or loses points based on voting outcomes.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-primary" />
              Indian National Parks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700">
              India has over 100 national parks covering approximately 40,500 sq km of land. These parks are home to numerous endangered and endemic species.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Biodiversity Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700">
              India is one of the 17 mega-biodiverse countries in the world, with national parks playing a crucial role in conservation efforts and ecological balance.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-primary" />
            How the ELO System Works
          </CardTitle>
          <CardDescription>
            Understanding the mathematical model behind our rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>
              The ELO rating system is a method for calculating the relative skill levels of players in zero-sum games. In our case, we're applying it to national parks based on user preferences.
            </p>
            
            <h3>The Mathematical Formula</h3>
            <p>
              When park A with rating Ra competes against park B with rating Rb, the expected score for park A is:
            </p>
            
            <pre className="bg-gray-100 p-3 rounded">Ea = 1 / (1 + 10^((Rb - Ra) / 400))</pre>
            
            <p>Similarly, the expected score for park B is:</p>
            
            <pre className="bg-gray-100 p-3 rounded">Eb = 1 / (1 + 10^((Ra - Rb) / 400))</pre>
            
            <p>
              After a matchup where park A wins (gets a score of 1) and park B loses (gets a score of 0), their ratings are updated:
            </p>
            
            <pre className="bg-gray-100 p-3 rounded">
Ra' = Ra + K × (Sa - Ea)
Rb' = Rb + K × (Sb - Eb)
            </pre>
            
            <p>
              Where K is the K-factor (usually 32 in our system) and Sa, Sb are the actual scores (1 for winner, 0 for loser).
            </p>
            
            <h3>Key Properties</h3>
            <ul>
              <li>A higher-rated park winning against a lower-rated one results in a small rating change</li>
              <li>A lower-rated park winning against a higher-rated one results in a larger rating change</li>
              <li>Ratings naturally converge to reflect the true relative "popularity" of parks</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-primary" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How is the ELO rating calculated?</AccordionTrigger>
              <AccordionContent>
                <p>
                  The ELO rating changes after each vote based on the expected probability of winning vs. the actual outcome. Each park starts with a rating of 1500. If a park wins against a higher-rated opponent, it gains more points than winning against a lower-rated one.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How are parks matched against each other?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Parks are randomly matched against each other to ensure a fair distribution of comparisons. The system tries to present a variety of matchups to users to gather comprehensive data.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I vote multiple times on the same matchup?</AccordionTrigger>
              <AccordionContent>
                <p>
                  No, once you vote on a matchup, a new matchup is generated. This ensures that the ranking system remains fair and prevents biased voting from skewing the results.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Where does the park information come from?</AccordionTrigger>
              <AccordionContent>
                <p>
                  The information about national parks is sourced from official government records, conservation organizations, and verified research sources. We strive to provide accurate and up-to-date information about each park.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>How can I contribute more information about parks?</AccordionTrigger>
              <AccordionContent>
                <p>
                  We welcome contributions from the community. If you have verified information, high-quality images, or corrections for any park, please contact us through the feedback form, and we'll review your submission.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
};

export default About;
