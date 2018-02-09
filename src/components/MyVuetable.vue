<script>
import moment from "moment";
import Vue from "vue";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePagination from "vuetable-2/src/components/VuetablePagination";
import VuetablePaginationInfo from "vuetable-2/src/components/VuetablePaginationInfo";
import CssConfig from "./VuetableCssConfig.js";

export default {
    name: "MyVuetable",
    components: {
        Vuetable,
        VuetablePagination,
        VuetablePaginationInfo
    },
    props: {
        api: {
            type: String,
            required: true
        },
        fields: {
            type: Array,
            required: true
        },
        sortOrder: {
            type: Array,
            default() {
                return [
                    {
                        field: "updateTime",
                        sortField: "updateTime",
                        direction: "asc"
                    }
                ];
            }
        },
        appendParams: {
            type: Object,
            default() {
                return {};
            }
        },
        detailModalComponent: {
            type: String,
            default: ""
        },
        detailRowComponent: {
            type: String,
            default: ""
        },
        formatter: Function
    },
    data() {
        return {
            isLoading: false,
            id: null,
            asc: true,
            perPage: 3,
            page: 1,
            apiRoot: "http://172.17.21.221:8088/admin/"
        };
    },
    render(h) {
        const elems = [
            // h('filter-bar'),
            h("div", {
                class: [
                    "ui",
                    "large",
                    "text",
                    "loader",
                    { active: this.isLoading }
                ]
            }),
            this.renderVuetable(h),
            this.renderPagination(h)
        ];
        if (this.detailModalComponent) {
            elems.push(this.renderDetailModal(h));
        }
        return h("div", { class: ["ui", "container"] }, elems);
    },
    methods: {
        // render related functions
        renderVuetable(h) {
            return h("vuetable", {
                ref: "vuetable",
                props: {
                    css: CssConfig,
                    apiUrl: this.apiRoot + this.api,
                    fields: [
                        ...this.fields,
                        {
                            name: "__slot:actions",
                            title: "",
                            titleClass: "center aligned",
                            dataClass: "center aligned"
                        }
                    ],
                    queryParams: {
                        sort: "orderBy",
                        page: "page",
                        perPage: "rows"
                    },
                    perPage: this.perPage,
                    dataPath: "data.rows",
                    paginationPath: "data",
                    multiSort: true,
                    sortOrder: this.sortOrder,
                    appendParams: { asc: this.asc, ...this.appendParams },
                    detailRowComponent: this.detailRowComponent
                },
                on: {
                    // custom events
                    "vuetable:pagination-data": this.onPaginationData,
                    "vuetable:row-clicked": this.onRowClicked,
                    "vuetable:loaded": () => {
                        this.isLoading = false;
                        $(".ui.dropdown").dropdown({ on: "hover" });
                    },
                    "vuetable:loading": () => {
                        this.isLoading = true;
                    },
                    "vuetable:load-success": payload => {
                        const { orderBy, asc } = payload.config.params;
                        this.orderBy = orderBy;
                        this.asc = asc;
                    },
                    // 将所有的监听器port给Vuetable
                    ...this.$listeners
                },
                // thats why use render function instead of template
                scopedSlots: {
                    ...this.$vnode.data.scopedSlots,
                    actions: ({ rowData, rowIndex }) => {
                        return (
                            <div class="ui dropdown item">
                                <i class="options icon" />
                                <div class="menu">
                                    <a class="item" onClick={
                                        event => { this.remove(rowData, event); }
                                    }> 删除 </a>
                                    <a class="item" onClick={
                                        event => { this.edit(rowData, event); }
                                    }> 编辑 </a>
                                </div>
                            </div>
                        );
                    }
                }
            });
        },
        renderPagination(h) {
            const dataObj = {
                class: ["vuetable-pagination", "ui", "basic", "segment", "grid"]
            };
            return h("div", dataObj, [
                h("vuetable-pagination-info", { ref: "paginationInfo" }),
                h("vuetable-pagination", {
                    ref: "pagination",
                    on: {
                        "vuetable-pagination:change-page": this.onChangePage,
                        ...this.$listeners
                        // custom events
                    }
                })
            ]);
        },
        renderDetailModal(h) {
            return h("div", { class: `ui modal detail-modal-${this.api}` }, [
                h(this.detailModalComponent, { props: { id: this.id } })
            ]);
        },
        onRowClicked(data, event) {
            this.id = data.id;
            // 显示详情
            const modal = $(`.detail-modal-${this.api}`).modal();
            // 有时候弹窗位置不对的quick fix
            setTimeout(() => { modal.modal("show"); }, 100);
        },
        onPaginationData(paginationData) {
            this.$refs.pagination.setPaginationData(paginationData);
            this.$refs.paginationInfo.setPaginationData(paginationData);
        },
        onChangePage(page) {
            switch (page) {
                case "next":
                    this.page = this.page + 1;
                    break;
                case "prev":
                    this.page = this.page - 1;
                    break;
                default:
                    this.page = page;
            }
            this.$refs.vuetable.changePage(page);
        },
        reload() {
            this.$refs.vuetable.reload();
        },
        async edit(data, event) {
            console.log("编辑", data.id);
            event.stopPropagation();
            this.$emit("edit", data.id);
        },
        async remove(data, event) {
            event.stopPropagation();
            console.log("删除", data.id);
            await this.$request({url: `${this.api}/${data.id}`, method: "delete"});
            this.$refs.vuetable.reload();
        },
        formatDate(value, fmt = "D MMM YYYY") {
            return value == null ? "" : moment(value, "YYYY-MM-DD").format(fmt);
        },
        onFilterSet(filterText) {
            this.appendParams.filter = filterText;
            Vue.nextTick(() => this.$refs.vuetable.refresh());
        },
        onFilterReset() {
            delete this.appendParams.filter;
            Vue.nextTick(() => this.$refs.vuetable.refresh());
        },
        getSortParam: function(sortOrder) {
            const sort = sortOrder[0]; // 只有第一个过滤支持
            this.asc = sort.direction !== "desc";
            // 服务器需要用下划线的形式
            return Vue.utils.toSnakeCase(sort.field);
            // return (sort.direction === 'desc' ? '+' : '') + sort.field
        },
        transform(data) {
            if (this.formatter) data = this.formatter(data);
            return this.paginationFormatter(data);
        },
        paginationFormatter(data) {
            const total = data.data.total;
            const lastPage = Math.ceil(total / this.perPage);
            const from = (this.page - 1) * this.perPage + 1;
            const to = total < this.perPage ? total : from + this.perPage - 1;
            const queryUrl = `${this.apiRoot}${this.api}?orderBy=${
                this.orderBy
            }&asc=${this.asc}&rows=${this.perPage}`;
            const prevPageUrl = `${queryUrl}?page=${this.page - 1}`;
            const nextPageUrl = `${queryUrl}?page=${this.page + 1}`;
            data.data = {
                ...data.data,
                per_page: this.perPage,
                current_page: this.page,
                last_page: lastPage,
                from,
                to: to > total ? total : to,
                prev_page_url: prevPageUrl,
                next_page_url: nextPageUrl
            };
            return data;
        }
    }
};
</script>
