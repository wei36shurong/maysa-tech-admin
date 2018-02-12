const defaultConfig = {
    tableClass: "ui blue selectable celled stackable attached table",
    loadingClass: "loading",
    ascendingIcon: "blue chevron up icon",
    descendingIcon: "blue chevron down icon",
    ascendingClass: "sorted-asc",
    descendingClass: "sorted-desc",
    sortableIcon: "",
    detailRowClass: "vuetable-detail-row",
    handleIcon: "grey sidebar icon",
    tableBodyClass: "vuetable-semantic-no-top vuetable-fixed-layout",
    tableHeaderClass: "vuetable-fixed-layout"
};
export default {
    ...defaultConfig,
    tableClass: "ui selectable plain gapped table"
};
