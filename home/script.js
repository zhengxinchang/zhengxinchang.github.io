const scriptUrl = new URL(document.currentScript.src);
const homeBaseUrl = new URL(".", scriptUrl);
const { createApp, nextTick } = Vue;

const setMeta = (selector, attr, value) => {
  const node = document.querySelector(selector);
  if (node && value) node.setAttribute(attr, value);
};

createApp({
  data() {
    return {
      activeId: "home",
      data: null,
      error: false,
      navOpen: false,
      observer: null,
      papers: [],
      expandedYears: {},
      year: new Date().getFullYear()
    };
  },

  computed: {
    featuredTools() {
      if (!this.data) return [];
      return this.data.tools
        .filter((tool) => tool.featured)
        .slice()
        .sort((a, b) => (a.featured_order || 999) - (b.featured_order || 999));
    },

    groupedPapers() {
      const groups = new Map();
      const toYearValue = (value) => {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : -Infinity;
      };

      this.papers.forEach((paper) => {
        const year = paper.year || "Unknown";
        if (!groups.has(year)) groups.set(year, []);
        groups.get(year).push(paper);
      });

      return Array.from(groups.entries())
        .sort((a, b) => toYearValue(b[0]) - toYearValue(a[0]))
        .map(([year, papers]) => ({ year, papers }));
    }
  },

  methods: {
    asset(path) {
      return new URL(path, homeBaseUrl).pathname;
    },

    closeNav() {
      this.navOpen = false;
      document.body.classList.remove("nav-open");
    },

    initObserver() {
      if (this.observer) this.observer.disconnect();
      const sections = ["home", "about", "research", "publications", "tools"]
        .map((id) => document.querySelector(`#${id}`))
        .filter(Boolean);

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) this.activeId = entry.target.id;
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );

      sections.forEach((section) => this.observer.observe(section));
    },

    isExternal(item) {
      return item.external || /^https?:\/\//.test(item.href);
    },

    setHead() {
      document.title = this.data.site.title;
      setMeta("meta[name='description']", "content", this.data.site.description);
      setMeta("meta[name='author']", "content", this.data.profile.name);
      setMeta("meta[property='og:title']", "content", this.data.site.title);
      setMeta("meta[property='og:description']", "content", this.data.site.og_description);
      setMeta("link[rel='icon']", "href", this.asset(this.data.site.favicon));
    },

    setStructuredData() {
      document.querySelector("#structured-data").textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: this.data.profile.name,
        url: this.data.site.url,
        sameAs: this.data.social.map((item) => item.href),
        affiliation: {
          "@type": "Organization",
          name: this.data.profile.affiliation
        }
      });
    },

    formatAuthors(value) {
      if (!value) return "Authors unavailable";
      return value.replace(/\s+and\s+/g, ", ");
    },

    publicationMeta(paper) {
      const meta = [paper.journal, paper.year].filter(Boolean);
      if (paper.volume) {
        meta.push(paper.number ? `${paper.volume}(${paper.number})` : paper.volume);
      }
      if (paper.pages) meta.push(paper.pages);
      return meta.join(" | ");
    },

    isYearExpanded(year, index) {
      if (Object.prototype.hasOwnProperty.call(this.expandedYears, year)) {
        return this.expandedYears[year];
      }
      return index < 1;
    },

    toggleYear(year, index) {
      const current = this.isYearExpanded(year, index);
      this.expandedYears = {
        ...this.expandedYears,
        [year]: !current
      };
    },

    topicNumber(index) {
      return String(index + 1).padStart(2, "0");
    }
  },

  watch: {
    navOpen(isOpen) {
      document.body.classList.toggle("nav-open", isOpen);
    }
  },

  async mounted() {
    try {
      const [yamlResponse, paperResponse] = await Promise.all([
        fetch(new URL("data.yml", homeBaseUrl)),
        fetch(new URL("paper.json", homeBaseUrl))
      ]);

      if (!yamlResponse.ok) throw new Error(`Unable to load data.yml: ${yamlResponse.status}`);
      if (!paperResponse.ok) throw new Error(`Unable to load paper.json: ${paperResponse.status}`);

      this.data = jsyaml.load(await yamlResponse.text());
      this.papers = await paperResponse.json();
      this.setHead();
      this.setStructuredData();
      await nextTick();
      this.initObserver();
    } catch {
      this.error = true;
    }
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
  }
}).mount("#app");
