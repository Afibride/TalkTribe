<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class NorthwestCameroonNewsSeeder extends Seeder
{
    public function run()
    {
        // Create a directory for news images if it doesn't exist
        if (!Storage::disk('public')->exists('news-images')) {
            Storage::disk('public')->makeDirectory('news-images');
        }

        $newsItems = [
            [
                'title' => 'TalkTribe Successfully Launches Language Learning Platform in Cameroon',
                'description' => 'TalkTribe, the innovative language learning platform, has officially launched in Cameroon with a focus on preserving and teaching local languages across the country.',
                'content' => '<p>TalkTribe is excited to announce the successful launch of our language learning platform throughout Cameroon. After months of development and testing, we are now live and ready to serve communities across the nation.</p>
                <p>Our platform offers interactive lessons, cultural content, and community features designed specifically for Cameroonian languages. The launch includes support for major local languages with plans to expand to more dialects in the coming months.</p>
                <p>"This launch represents a significant milestone in our mission to preserve and promote linguistic diversity in Cameroon," said CEO Dr. Amina Bello. "We believe that every language tells a unique story, and we\'re committed to ensuring these stories continue to be told for generations to come."</p>
                <p>The platform is available on web and mobile devices, making language learning accessible to urban and rural communities alike. Special features include offline mode for areas with limited internet connectivity and voice recognition for pronunciation practice.</p>
                <p>To celebrate the launch, TalkTribe is offering free premium access for the first three months to all Cameroonian users.</p>',
                'image' => 'news-images/talktribe-launch.png',
                'tag' => 'ANNOUNCEMENT',
                'author' => 'TalkTribe Team',
                'published_at' => Carbon::now()->subDays(2),
                'is_published' => true,
                'views' => 150
            ],
            [
                'title' => 'Nso Fon Palace Restoration Project Receives International Funding',
                'description' => 'The historic Fon Palace in Kumbo, Nso Kingdom, has received $2 million in international grants for restoration and preservation of cultural heritage.',
                'content' => '<p>The Nso Fon Palace, one of the most significant cultural landmarks in the Northwest Region of Cameroon, has been awarded a $2 million grant from the UNESCO World Heritage Fund. This funding will support the comprehensive restoration of the palace structures, which date back to the 18th century.</p>
                <p>The restoration project aims to preserve traditional architectural techniques while incorporating modern conservation methods. Local artisans from the Nso community will be trained in traditional building methods, ensuring the transfer of cultural knowledge to younger generations.</p>
                <p>Fon Sehm Mbinglo I expressed his gratitude: "This project will not only preserve our physical heritage but also strengthen our cultural identity and provide economic opportunities for our people through cultural tourism."</p>
                <p>The project is expected to take three years to complete and will include the creation of a cultural museum and visitor center.</p>',
                'image' => 'news-images/culture1.jpg',
                'tag' => 'CULTURE',
                'author' => 'Cultural Heritage Reporter',
                'published_at' => Carbon::now()->subDays(5),
                'is_published' => true,
                'views' => 89
            ],
            [
                'title' => 'Bamenda Cultural Festival Celebrates Diversity of Northwest Tribes',
                'description' => 'The 15th annual Bamenda Cultural Festival brought together over 20 ethnic groups from the Northwest Region for a week of traditional performances, food, and cultural exchange.',
                'content' => '<p>The city of Bamenda recently hosted its annual cultural festival, showcasing the rich diversity of traditions from across the Northwest Region. The event featured performances from the Bamoun, Tikar, Widikum, Bali, and many other ethnic groups.</p>
                <p>Highlights included traditional dance performances, craft exhibitions, culinary demonstrations, and storytelling sessions. The festival also hosted discussions on cultural preservation in the modern era.</p>
                <p>Dr. Amina Bello, cultural anthropologist and festival organizer, stated: "This festival is crucial for maintaining inter-ethnic harmony and preserving our diverse cultural heritage. It provides a platform for different communities to share their traditions and learn from each other."</p>
                <p>The event attracted over 10,000 visitors, including international tourists and cultural researchers. Plans are already underway for next year\'s festival, which will focus on traditional textile arts.</p>',
                'image' => 'news-images/culture1.jpg',
                'tag' => 'FESTIVAL',
                'author' => 'Festival Correspondent',
                'published_at' => Carbon::now()->subDays(12),
                'is_published' => true,
                'views' => 234
            ],
            [
                'title' => 'Traditional Medicinal Knowledge of Oku Community Documented in New Research',
                'description' => 'Researchers from University of Bamenda have completed a comprehensive documentation of traditional healing practices and herbal medicine knowledge in the Oku community.',
                'content' => '<p>A groundbreaking research project has successfully documented the extensive traditional medicinal knowledge of the Oku people in the Northwest Region. The three-year study recorded over 200 medicinal plants and their traditional uses.</p>
                <p>The research team, led by Dr. Samuel Nfor, worked closely with traditional healers and elders to ensure accurate documentation of healing practices that have been passed down orally for generations.</p>
                <p>"This documentation is vital for preserving knowledge that is at risk of being lost," explained Dr. Nfor. "Many young people are moving to cities and not learning these traditional practices. Our work ensures this valuable knowledge is preserved for future generations."</p>
                <p>The research has been published in both academic journals and community-friendly handbooks, making it accessible to both scientists and local communities. The project has also led to the establishment of a community medicinal garden to conserve rare plant species.</p>',
                'image' => 'news-images/culture13.webp',
                'tag' => 'RESEARCH',
                'author' => 'Science and Culture Editor',
                'published_at' => Carbon::now()->subDays(18),
                'is_published' => true,
                'views' => 176
            ],
            [
                'title' => 'Bafut Palace Named Among Africa\'s Top 100 Cultural Heritage Sites',
                'description' => 'The historic Bafut Palace has been included in the prestigious list of Africa\'s Top 100 Cultural Heritage Sites by the African Cultural Heritage Foundation.',
                'content' => '<p>The Bafut Palace, home to the Fon of Bafut and a center of Tikar cultural heritage, has received international recognition as one of Africa\'s most important cultural sites. The palace complex includes traditional structures, sacred spaces, and a museum housing royal artifacts.</p>
                <p>The recognition comes with a $500,000 grant for conservation efforts and the development of sustainable tourism infrastructure. This will include improved visitor facilities, guided tour programs, and community training in cultural tourism management.</p>
                <p>Fon Abumbi II expressed his satisfaction: "This recognition validates our efforts to preserve our cultural heritage while adapting to modern times. It will help us protect our traditions and share them with the world in a sustainable way."</p>
                <p>The palace attracts thousands of visitors annually and serves as an important educational center for both locals and international researchers studying Tikar culture and history.</p>',
                'image' => 'news-images/culture3.jpg',
                'tag' => 'HERITAGE',
                'author' => 'Heritage Conservation Writer',
                'published_at' => Carbon::now()->subDays(25),
                'is_published' => true,
                'views' => 312
            ],
            [
                'title' => 'Kom Cultural Dance Troupe Wins International Folk Dance Competition',
                'description' => 'The Kom Cultural Dance Troupe from Northwest Cameroon has won first prize at the International Folk Dance Festival in Marrakech, Morocco.',
                'content' => '<p>The Kom Cultural Dance Troupe, representing the Kom people of Northwest Cameroon, has brought international recognition to Cameroonian cultural arts by winning the prestigious Golden Dhow award at the Marrakech International Folk Dance Festival.</p>
                <p>The troupe performed traditional dances including the "Nwerong" royal dance and "Abooh" warrior dance, captivating the international audience and judges with their vibrant costumes, intricate movements, and powerful musical accompaniment.</p>
                <p>Troupe leader Mabel Ngeh commented: "This victory is not just for Kom people but for all of Cameroon. It shows the world the richness and vitality of our cultural traditions. We are preserving our heritage while sharing it globally."</p>
                <p>The win has sparked increased interest in Cameroonian traditional arts, with several international cultural organizations expressing interest in hosting performances and workshops featuring the troupe.</p>',
                'image' => 'news-images/culture1.jpg',
                'tag' => 'PERFORMANCE',
                'author' => 'Arts and Culture Correspondent',
                'published_at' => Carbon::now()->subDays(32),
                'is_published' => true,
                'views' => 198
            ],
            [
                'title' => 'Bambui Pottery Cooperative Revives Ancient Ceramic Traditions',
                'description' => 'A women-led cooperative in Bambui is successfully reviving traditional pottery techniques while creating economic opportunities for local artisans.',
                'content' => '<p>In the village of Bambui, a remarkable cultural revival is underway. A cooperative of women potters has successfully restored ancient ceramic traditions that were nearly lost, while also creating sustainable livelihoods for community members.</p>
                <p>The cooperative, supported by the Ministry of Arts and Culture, has trained over 50 young women in traditional pottery techniques specific to the Tikar people. Their products combine traditional designs with contemporary functionality, appealing to both local and international markets.</p>
                <p>Cooperative leader Martha Che explains: "Our grandmothers made pottery this way, but the knowledge was disappearing. Now we\'re preserving our heritage while earning income for our families. Our products tell the story of our culture."</p>
                <p>The cooperative has received orders from boutique hotels, restaurants, and cultural institutions across Cameroon and has begun exporting to European markets. Plans are underway to establish a cultural center where visitors can learn about traditional pottery and participate in workshops.</p>',
                'image' => 'news-images/culture4.jpg',
                'tag' => 'ARTISAN',
                'author' => 'Cultural Economy Reporter',
                'published_at' => Carbon::now()->subDays(40),
                'is_published' => true,
                'views' => 145
            ],
            [
                'title' => 'Ngemba Language Digital Archive Launched to Preserve Endangered Tongue',
                'description' => 'Linguists and community elders have collaborated to create a comprehensive digital archive of the Ngemba language, classified as endangered by UNESCO.',
                'content' => '<p>In a significant step toward language preservation, the Ngemba Language Project has launched a comprehensive digital archive documenting the Ngemba language spoken in the Bamenda area. The language has been classified as "definitely endangered" by UNESCO.</p>
                <p>The archive includes audio recordings of native speakers, dictionaries, grammatical guides, and cultural texts. The project involved collaboration between linguistic researchers from University of Yaoundé I and Ngemba community elders.</p>
                <p>Project coordinator Dr. Emmanuel Tangwa stated: "Language is the vehicle of culture. When a language dies, unique ways of understanding the world are lost forever. This digital archive ensures that Ngemba language and culture will be preserved for future generations."</p>
                <p>The archive is accessible to community members, researchers, and the general public through a dedicated website and mobile application. The project also includes community language classes and the development of educational materials for schools.</p>',
                'image' => 'news-images/culture1.jpg',
                'tag' => 'LANGUAGE',
                'author' => 'Linguistics and Culture Writer',
                'published_at' => Carbon::now()->subDays(47),
                'is_published' => true,
                'views' => 267
            ],
            [
                'title' => 'Traditional Rainmaking Ceremony in Kedjom Keku Draws International Attention',
                'description' => 'The ancient rainmaking ceremony of the Kedjom Keku people has attracted cultural anthropologists and documentarians from around the world.',
                'content' => '<p>The Kedjom Keku community in the Northwest Region recently performed their traditional rainmaking ceremony, a practice that dates back centuries. The event drew researchers, documentarians, and cultural enthusiasts from several countries.</p>
                <p>The ceremony, led by traditional priests and community elders, involves specific rituals, songs, and offerings believed to invoke rainfall. While modern climate science exists alongside these traditions, the community maintains the ceremony as an important cultural practice.</p>
                <p>Cultural anthropologist Dr. Sarah Johnson, who documented the event, explained: "These ceremonies are not just about weather manipulation. They are complex cultural performances that reinforce community bonds, transmit traditional knowledge, and maintain spiritual connections to the land."</p>
                <p>The increased attention has led to discussions within the community about cultural tourism and how to share their traditions with outsiders while maintaining their sacred nature and community control over the narrative.</p>',
                'image' => 'news-images/culture2.jpg',
                'tag' => 'TRADITION',
                'author' => 'Cultural Anthropology Correspondent',
                'published_at' => Carbon::now()->subDays(55),
                'is_published' => true,
                'views' => 189
            ],
            [
                'title' => 'New Community Radio Station to Broadcast in Local Languages',
                'description' => 'A new community radio station has launched in the Northwest Region, broadcasting content in multiple local languages to promote linguistic diversity.',
                'content' => '<p>A groundbreaking community radio station has begun broadcasting in the Northwest Region, with programming in several local languages including Lamnso, Kom, and Medumba. The station aims to promote linguistic diversity and provide culturally relevant content to rural communities.</p>
                <p>The initiative is a collaboration between local community leaders, linguists, and international development organizations. Programming includes news, educational content, cultural programs, and music from different ethnic groups in the region.</p>
                <p>Station manager Thomas Nformi explained: "For many communities, especially elders and those in rural areas, local languages are their primary means of communication. This radio station ensures they have access to important information in languages they understand."</p>
                <p>The station also serves as a platform for preserving oral traditions, with regular segments featuring storytelling, proverbs, and historical narratives from different cultural groups in the region.</p>',
                'image' => 'news-images/community-radio.jpg',
                'tag' => 'MEDIA',
                'author' => 'Community Development Writer',
                'published_at' => Carbon::now()->subDays(62),
                'is_published' => true,
                'views' => 123
            ],
            [
                'title' => 'Traditional Weaving Techniques Featured in International Fashion Show',
                'description' => 'Traditional weaving techniques from the Northwest Region were showcased at an international fashion show in Paris, bringing global attention to Cameroonian textile arts.',
                'content' => '<p>Traditional weaving techniques from Cameroon\'s Northwest Region recently gained international recognition when featured in a prestigious fashion show in Paris. Designs incorporating traditional Bamoun and Bamileke fabrics were showcased alongside works from renowned international designers.</p>
                <p>The featured textiles included Ndop cloth from the Bamileke people and woven raffia fabrics from the Bamoun kingdom, both known for their intricate patterns and symbolic meanings. These traditional techniques were reinterpreted in contemporary fashion designs.</p>
                <p>Designer Amina Bello, who incorporated these traditional elements into her collection, stated: "These textiles tell stories of our history and cultural identity. By bringing them to the international stage, we\'re showing that African traditions have a place in global fashion while creating economic opportunities for local artisans."</p>
                <p>The exposure has already led to increased orders for traditional weavers in the Northwest Region, providing sustainable income for these skilled artisans.</p>',
                'image' => 'news-images/culture13.webp',
                'tag' => 'ARTISAN',
                'author' => 'Fashion and Culture Correspondent',
                'published_at' => Carbon::now()->subDays(70),
                'is_published' => true,
                'views' => 278
            ],
            [
                'title' => 'Digital Museum of Northwest Cameroonian Culture Now Online',
                'description' => 'A new digital museum showcasing the cultural heritage of Northwest Cameroon has launched, making cultural artifacts accessible to a global audience.',
                'content' => '<p>A comprehensive digital museum dedicated to the cultural heritage of Northwest Cameroon has officially launched, providing virtual access to cultural artifacts, historical photographs, and educational resources about the region\'s diverse ethnic groups.</p>
                <p>The museum features high-resolution images of traditional artifacts, audio recordings of oral histories, and interactive maps showing the distribution of different cultural practices across the region. Content is available in multiple languages, including English, French, and several local languages.</p>
                <p>Project director Dr. Samuel Nfor explained: "Many cultural artifacts from our region are housed in museums abroad or in private collections. This digital museum allows people in Cameroon and around the world to learn about our rich cultural heritage, regardless of their location."</p>
                <p>The platform also includes educational resources for schools and a marketplace where local artisans can sell traditional crafts, providing economic benefits to communities while preserving cultural traditions.</p>',
                'image' => 'news-images/culture4.jpg',
                'tag' => 'TECHNOLOGY',
                'author' => 'Digital Heritage Writer',
                'published_at' => Carbon::now()->subDays(78),
                'is_published' => true,
                'views' => 204
            ]
        ];

        foreach ($newsItems as $newsItem) {
            // Generate slug from title if not provided
            if (!isset($newsItem['slug'])) {
                $newsItem['slug'] = Str::slug($newsItem['title']);
            }

            $existingNews = News::where('slug', $newsItem['slug'])->first();
            
            if (!$existingNews) {
                News::create($newsItem);
            }
        }

        $this->command->info('Successfully seeded Northwest Cameroon cultural news with image URL support!');
    }
}