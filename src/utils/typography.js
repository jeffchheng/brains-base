import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  const mainColor = `#03dac5`
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    body: {
      color: `white`,
      "background-color": `#121212`,
    },
    blockquote: {
      color: `white`,
      borderLeft: `0.25rem solid white`,
    },
    a: {
      color: mainColor,
    },
    h1: {
      color: mainColor,
    },
    h2: {
      color: mainColor,
    },
    h3: {
      color: mainColor,
    },
    h4: {
      color: mainColor,
    },
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
