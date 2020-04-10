---
title: My Tech Interview Experience
date: "2020-04-10T12:00:00.000Z"
description: Weeks of interviews have taught me one thing, and it's that interviewing sucks.
---
 
Weeks of interviews have taught me one thing, and it's that interviewing sucks.
 
But thank god it's over now that I've accepted a new position at Amazon as a front end engineer working on Alexa Machine Learning Platform Services (say that 5 times fast). I signed an NDA at Amazon, so I can't talk about specifics, but I can speak to some of the other companies I've interviewed at, my experiences, and key takeaways.
 
## Key Takeaways (TL;DR)
 
Tech interviews are tough, so here are the resources that helped me the most.
 
Know the HTML, CSS, JS, and DOM APIs. Seems obvious, but make sure you know how to traverse DOM trees, node lists, and how the JS API differs from HTML.
 
[Leetcode Patterns](https://medium.com/leetcode-patterns) really helped me recognize patterns in problems and how to solve them. Many times, interview questions will resemble Leetcode problems but not be exactly the same. So you need to be able to adapt and use the patterns to come up with a novel solution. You can get lucky with memorization, but these patterns tip the scales in your favor.
 
The DFS, BFS, brute force, and tree traversal sections are the most relevant to front end engineers. Some interviews have string parsing, but they're becoming less common.
 
[Top 100 Leetcode Problems](https://www.teamblind.com/article/New-Year-Gift---Curated-List-of-Top-100-LeetCode-Questions-to-Save-Your-Time-OaM1orEU): If you don't have time to just grind Leetcode, this list will help you understand the basic premise and patterns that recur in coding interviews.
 
For system design interviews, I recommend picking a random app (e.g., Facebook, Twitter, Pinterest, Contacts) and writing out how you would design it. Start with all CRUD API operations, describe the data shape (input _and_ output), front end design, and user experience - the flow the user goes through. Also consider optimizations like caching, normalization, infrastructure, etc.
 
Practice the [STAR Interview Method](https://www.youtube.com/watch?v=WSbN-0swDgM) and come up with stories from your experience. Think about all the projects you've worked on and write them all out - everything you did, who you worked with, the successes, failures, what you've learned, and so on. It helped me to write out at least 6 to 9 of these so I got a feel for how to word these. Even if someone asked me something that didn't fit what I already wrote, I could recall the projects I worked on right away without too much lag time.
 
## Facebook (2019)
 
Contacted by recruiter.
 
Shout-outs to Facebook for having one of the best interviewing experiences, even though I didn't get in. They really pioneered the way for front end engineer interviews to be less about data structures and algorithms in the Leetcode sense and more about JavaScript, DOM knowledge, and tree traversals.
 
The interviewers were all incredibly prepared. I could tell they knew every possible solution to the problem they asked of me. They were quick to point out mistakes or offer hints. The questions were well defined and able to be answered quickly.
 
Facebook interviews are also pretty rapid-fire. Every round had two coding questions I was able to do at least.
 
### Phone Screen
 
For example, for their phone screen, the interviewer gave me a list of example calls to an API, and I had to implement something that conforms to it.
 
There was another question about writing a function that will flatten an array. I thought this was fun.
 
### On-Sites
 
System design: design Pinterest. Some considerations include how to handle thousands of images, infinite scrolling, how to order the images in the layout, caching, APIs, etc.
 
I didn't really have much experience with system design interviews before this, so I bombed this one so, so hard.
 
The coding questions were a standard mix of code optimization of O(N^2) (nested loops) to O(N) (one loop), DOM tree traversals, monkey patching globals (setTimeout and clearTimeout), async programming, and so on.
 
## Microsoft (2019)
 
Referred by a friend.
 
Microsoft by far has the worst recruiter experience and most rigid interviewing process. There is an extremely low chance that you will get a callback from a recruiter if you apply normally. You 99% need a referral from someone who will message the engineering manager directly.
 
Some of the interviewers asked me a question and then went back to working without hints. They didn't seem like they were aware of alternative solutions to their problems. They wanted the optimal solution or nothing at all.
 
### Phone Screen
 
One of the worst experiences. The question was so vague. I was aware it was a binary search question but didn't really know how to code an answer because the requirements were really out there. Granted, this _was_ for a senior position, but still.
 
Somehow, I bumbled my way to a solution and got an on-site.
 
### On-Sites
 
System design: Design Facebook. Again, I was really, really bad at system design. Now I kind of get the motions you have to go through: define APIs; define infrastructure like storage, caching, servers, etc.; front end layout; security; and all that jazz.
 
Three coding questions. They didn't take the entire time so a lot of the interview was pretty awkward. I definitely would've liked more structure or more coding questions.
 
Given a binary search tree, find and return two values that add up a target. A very typical Leetcode problem. I came up with an O(N) space algorithm, which wasn't what the interviewer wanted. I think they wanted the left and right pointer solution or Set solution.
 
Given a list of managers and their employees, find the CEO or something? I don't recall. It requires building a map and iterating to find the solution - typical stuff.
 
## Carta (2019)
 
Contacted by recruiter.
 
One of my worst interview experiences by far. When I arrived at the office, no one was there to badge me up or answer my calls for 20 minutes.
 
### Phone Screen
 
They showed me a gif of an accordion and told me to build it in Code Sandbox or something. Anytime someone asks me to build something quick in React, it's gonna be easy for me. 😎
 
I know companies don't want to hire someone who just knows React and not the underlying language or systems, so I get why they don't ask too many of these.
 
### On-Sites
 
System design: Design a site where users can ask lawyers questions. There were some interesting problems here like location and jurisdiction. Lawyers can only legally operate in one area. How do you design the login and authentication experience? I definitely recommend knowing about the exact flow for OAuth.
 
There was one on-site coding question. Given some requirements and shitty code, make it better. "There's no right answer." By far one of the worst questions I've seen. And having only one gives no reliable signal.
 
## Twitch (2020)
 
Applied online. Recruiter got back fairly quickly.
 
### Online Assessment
 
The first and only online assessment I'll ever do.
 
The question was basically battleships. Given the location of battleships for players one and two and where they are attacking, return the result of the game; that is, the number of hit and sunk ships for each player.
 
I thought I did well on this based on string parsing, but I completely ignored one of the parameters - the size of the board - so maybe I didn't pass one of the hidden test cases.
 
Oh well, no on-site offer extended.
 
## Redfin
 
Applied online. Recruiter got back fairly quickly.
 
### Take-home Assignment
 
The first and only take-home assignment I'll ever do. An incredible waste of time considering the length of time it took.
 
Given a JSON file containing an array of photo data, use this via the fetch API to build an image gallery with lightbox support when you click an image. All this must be done in vanilla JavaScript, HTML, and CSS.
 
I followed some of the practices Instagram does where it does a grid that doesn't change much. I implemented really shitty prefetching and a makeshift version of React based on HyperScript. It wasn't great, but I figured it was good enough for an on-site. Alas... it wasn't meant to be.
 
## Dropbox
 
Applied online. Recruiter got back fairly quickly. They tend to uplevel you during an interview loop, so I was interviewing for a senior position.
 
### Phone Screen
 
Implement a function that given "a > b > c" return all nodes that have classes that match that pattern.
 
This was a fun problem using your typical tree traversal while keeping track of currently visited nodes that match the pattern and adding to the output before returning. I finished this pretty quickly and moved on to a follow-up.
 
### On-Site
 
System design: design an API for managing a contact list. This was one of the worst interview experiences as well. One, the question isn't great for a front end engineer. Second, the interviewer had unspoken questions that he wanted me to answer. I could tell he was annoyed or not accepting any answer from me that didn't conform to the format he wanted without explicitly telling me.
 
I design the usual CRUD operations, but I think he literally wanted me to define "okay, this is the HTTP accept and object shape" and "this is the HTTP content type and object shape" when they really didn't differ that much. Also scaling issues?
 
Deep dive: You need to be ready to talk about a project for an hour straight where the interviewer will drill you on what you worked on, technical/people challenges, and so on.
 
One of the coding questions was actually an existing MVC app with 7 bugs and repro steps for all of them, and it was up to me to fix them. There were problems like not merging objects correctly, CSS issues, XSS problems, and unmounting DOM nodes. This is interesting in concept, but the high pressure situation of an interview meant I wasn't able to fully commit by brain to it while working against the clock. Huge props to any Dropboxer who manages to fix these in less than an hour.
 
I don't remember the second coding question, but I recall it going pretty well.
 
Again, I don't think 2 coding questions provide a good enough signal, but I could just be salty.
 
## Amazon (2020)
 
Contacted by recruiter. I didn't think the role was a good fit, so they found me a front end engineer role that I eventually interviewed for and accepted. :)
 
I can't go into too much detail, but I will say their process is more like Facebook than other companies. Front end engineering questions are more JavaScript and DOM related than straight data structures and algorithms. A+ from me.
 
System design was much more reasonable, and the interviewers were more aware of potential solutions and gave me time to go from suboptimal to optimal. It definitely felt more collaborative than other interview experiences.
 
## Compass (2020)
 
Contacted by recruiter. My friend works there, so I decided to give them a shot.
 
### Phone Screen
 
They outsource this part to Karat.
 
The interviewer for Karat seemed pretty knowledgeable. They answered some teaser-type JavaScript questions at first before diving into the coding portion, like hoisting and closures. They also asked some interesting app dev-specific questions.
 
The coding questions involved being given a list of pairs representing parent and child nodes: `[parentValue, childValue]`. You may assume no cycles and that the tree is valid.
 
Write a function that returns a list containing the list of children with zero parents and children with one parent. The two follow-ups were similar tree-like traversals.
 
### On-Site
 
Write a function that parses a string containing a mathematical expression without parentheses and evaluates the expression. There's a known algorithm for this, but I didn't know it off the top of my head, so I just went through the signs `['*', '/', '+', '-']` and evaluated the left and right hand sides until all the signs were gone.
 
Given an app and some requirements, fulfill the requirements. This was some draggable interface, which I thought was interesting, but again, this is gauging vanilla HTML and JS knowledge and not really skill. I was able to fulfill the requirements but couldn't get the math right on the final requirement.
 
So I failed this one. But since they laid off and rescinded some offers, I lucked out here.
 
## Final thoughts
 
Tech interviews are tough. I get why companies want to have multiple rounds to get enough signal, but the process is all over the place. Some companies like Facebook and Amazon have completely separate tracks for front end and back end engineers. (Full stack is a meme.) Their interviewers more accurately assess the skills a competent FEE/web dev should have.
 
Others still rely on data structure and algorithm questions that are really filtering for people who have hours upon hours to study Leetcode. If they ask a pattern you've seen before, great, you can probably derive the solution from previous problems or patterns. Otherwise, you're pretty screwed unless you're just really great at algorithms.
 
System design is by far my least favorite interview type because everyone has different expectations, and they always say, "Oh, there's no right answer," when they absolutely have a right answer in their head. If you don't hit the points they won't tell you to hit, you fail. There needs to be more rigor around these.
 
Sadly, I don't have a solution. It's difficult to gauge if someone is going to be toxic for a work environment when they've likely prepared hours for this interview and won't reveal their hand in one hour with the interviewer. It's difficult to gauge competency when questions these days depend more on knowledge or grinding problems online, but you also want someone who can learn new things.
 
In the end, I'm glad to be done. I failed a lot, and rejection sucks. Luckily, Leetcode patterns are like riding a bike - it only takes a few problems to jog my memory. I studied a bunch in 2019, took a year-long break, then came into 2020 without too much grinding. So if it ever comes to interviewing again, I think I'll be in good shape. It just takes some practice.
