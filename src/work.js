// type: "photo" or "video"
// tall: true  → portrait 9:16 card (use for phone-shot videos)
// poster: optional preview image shown before a video loads
export const work = [
  {
    type: "photo",
    src: "/photos/story.png",
    caption: "ch prathik — drumattorney",
    story: {
      kicker: "my story",
      title: "how i ended up behind the kit.",
      paragraphs: [
        "The Story behind the sticks...It all started with a kid turning everyday utensils into a drum kit. In fourth grade, my dad bought me my first real kit, and I began teaching myself through YouTube, one beat at a time.",
        "Joining Phanindra Sir's academy helped me take drumming seriously and build discipline. In 2022, I started my first band, explored opportunities with other bands, and eventually returned to building something of my own.",
        "Today, with over 700 live shows and opportunities to share the stage with playback singers, drumming has become more than a passion. It's a part of who I am.",
        "And this is only the beginning."
      ],
    },
  },
  {
    type: "video",
    src: "/videos/class.mp4",
    caption: "in class",
    tall: true,
  },
  {
    type: "video",
    src: "/videos/ossa.mp4",
    caption: "ossa",
    tall: true,
  },
  {
    type: "video",
    src: "/videos/sound-check.mp4",
    caption: "sound check",
    tall: true,
  },
];