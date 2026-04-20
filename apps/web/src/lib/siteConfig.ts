const publicEmail =
  import.meta.env.VITE_PUBLIC_EMAIL || "info.krishnasingh.codes@gmail.com";

export function rot13(value: string) {
  return value.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= "Z" ? 65 : 97;
    return String.fromCharCode(base + ((char.charCodeAt(0) - base + 13) % 26));
  });
}

export const siteConfig = {
  name: import.meta.env.VITE_PUBLIC_NAME || "Krishna Singh",
  headline:
    import.meta.env.VITE_PUBLIC_HEADLINE ||
    "7th semester software developer building practical developer tools.",
  githubUrl:
    import.meta.env.VITE_PUBLIC_GITHUB_URL ||
    "https://github.com/Rarebuffalo",
  githubUsername:
    import.meta.env.VITE_PUBLIC_GITHUB_USERNAME || "Rarebuffalo",
  linkedinUrl:
    import.meta.env.VITE_PUBLIC_LINKEDIN_URL ||
    "https://www.linkedin.com/in/krishna-singh-8a06461b8",
  email: publicEmail,
  encodedEmail: rot13(publicEmail),
  leetcodeUrl:
    import.meta.env.VITE_PUBLIC_LEETCODE_URL ||
    "https://leetcode.com/u/krishnasingh020/",
};
