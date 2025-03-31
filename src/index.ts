import { Scraper, SearchMode } from "agent-twitter-client";
import { PrismaClient } from "@prisma/client";
import { answer_query } from "./ai";
import { search_cookies, write_cokkies } from "./cokkies";



const prisma = new PrismaClient();
const searchScraper = new Scraper();
const writeTweetsScraper = new Scraper();

(async () => {
  try {
    await searchScraper.setCookies(search_cookies);
    await writeTweetsScraper.setCookies(write_cokkies);
    const search_login = await searchScraper.isLoggedIn();
    const write_login = await writeTweetsScraper.isLoggedIn();
    if (!search_login || !write_login) {
      throw new Error("Failed to log in");
    }
    console.log("Logged in successfully");
    // if (search_login && write_login) {
    // twitter();
    // }
  } catch (error) {
    console.error("Failed to set cookies:", error);
  }
})();

async function twitter() {
  console.log("Checking for new tweets");
  // cach the username in the db
  // if the username is first time calling the bot, then provide steps to enable blinks in wallet
  const mentions = searchScraper.searchTweets(
    `@${username}`,
    20,
    SearchMode.Latest,
  );

  // Get all processed tweet IDs (both original and replies) from the database
  const processedTweets = await prisma.query.findMany({
    select: {
      tweet_id: true,
      response_tweet_id: true, // We'll add this field
    },
  });

  const processedTweetIds = new Set([
    ...processedTweets.map((entry) => entry.tweet_id),
    ...processedTweets
      .map((entry) => entry.response_tweet_id)
      .filter((id) => id), // Include reply IDs
  ]);

  const tweetPromises = [];

  for await (const tweet of mentions) {
    // console.log(tweet.permanentUrl);
    console.log(tweet.id);
    if (
      processedTweetIds.has(tweet.id!) ||
      processedTweetIds.has(tweet.conversationId!)
    ) {
      continue;
    }
    if (tweet.username === username) continue;

    // Check if it's a reply/comment AND contains our bot mention
    const isValidMention =
      tweet.text!.includes(`@${username}`) &&
      (!tweet.isReply || tweet.mentions.some((m) => m.username === username));

    if (!isValidMention) continue;

    tweetPromises.push(
      (async () => {
        try {
          // Store the original question context
          let questionText = tweet.text;
          // If it's a reply, try to get the parent tweet's text
          if (tweet.isReply && tweet.conversationId) {
            try {
              const parentTweet = await searchScraper.getTweet(
                tweet.conversationId,
              );
              if (parentTweet) {
                questionText = `${parentTweet.text} | Reply: ${tweet.text}`;
              }
            } catch (error) {
              console.log(`Couldn't fetch parent tweet: ${error}`);
            }
          }
          questionText = questionText!
            .replace(/\s*@blinkaibot\s*/gi, "")
            .trim();

          const ai_res = await answer_query(questionText!);

          console.log("url: ", ai_res);

          if (ai_res) {
            const user = await prisma.query.findMany({
              where: {
                username: tweet.username,
              },
            });
            console.log(user.length);

            let text = ai_res;
            if (user.length === 0) {
              text = `Hi @${tweet.username} I See this the first time you are calling me, I am blinkaibot. 
To enable blinks in your wallet, follow the steps below:

Solflare wallet:
  Security & Privacy > Solana Actions > Enable Solana Actions.

Phantom wallet: 
  Go to Settings > Select Experimental Features > Toggle Blinks ON

Backpackwallet:
  Click on Profile icon top left > Settings > Solana > Toogle Solana Actions
                      
Once you enable it just refresh the page and see the magic happen.
                      
${ai_res}`;
            }
            const sendTweet = await writeTweetsScraper.sendLongTweet(
              text,
              tweet.id,
            );

            console.log(`Tweet processed: ${sendTweet.status}`);

            await prisma.query.create({
              data: {
                tweet_id: tweet.id!,
                response_tweet_id: tweet!.conversationId!,
                response: ai_res,
                username: tweet.username!,
                query: tweet.text!,
              },
            });

            processedTweetIds.add(tweet.id!);
            processedTweetIds.add(tweet.conversationId!);
          }
        } catch (error) {
          console.error(`Failed to process tweet ${tweet.id}:`, error);
        }
      })(),
    );
    await Promise.all(tweetPromises);
  }
}

// twitter();
setInterval(twitter, 1000 * 30 * 1); // every 2 min

/* 
  * {
  bookmarkCount: 0,
  conversationId: '1899526258599612710',
  id: '1899526258599612710',
  hashtags: [],
  likes: 0,
  mentions: [
    {
      id: '1899065665270771712',
      username: 'blink_ai_bot',
      name: 'eagle'
    }
  ],
  name: 'chilled koala',
  permanentUrl: 'https://twitter.com/ChilledKoala/status/1899526258599612710',
  photos: [],
  replies: 1,
  retweets: 0,
  text: '@blink_ai_bot  swap usdc to sol',
  thread: [],
  urls: [],
  userId: '1734125719377399808',
  username: 'ChilledKoala',
  videos: [],
  isQuoted: false,
  isReply: false,
  isRetweet: false,
  isPin: false,
  sensitiveContent: false,
  timeParsed: 2025-03-11T18:22:06.000Z,
  timestamp: 1741717326,
  html: '<a href="https://twitter.com/blink_ai_bot">@blink_ai_bot</a>  swap usdc to sol',
  views: 6
}
*/
