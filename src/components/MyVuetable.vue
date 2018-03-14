<script>
import moment from "moment";
import Vue from "vue";
import CssConfig from "./VuetableCssConfig.js";
import config from "@/conf/config";
import Vuetable from "vuetable-2/src/components/Vuetable";
// import FilterBar from "@/components/FilterBar";

export default {
    name: "MyVuetable",
    // components: {FilterBar},
    props: {
        ...Vuetable.props,
        rowClass: {
            type: String,
            default: "clickable"
        },
        perPage: {
            type: Number,
            default: 20
        },
        paramPrefix: {
            type: String,
            default: ""
        },
        api: {
            type: String
        },
        fields: {
            type: Array,
            required: true
        },
        showActions: {
            type: Boolean,
            default: true
        },
        sortOrder: {
            type: Array,
            default() {
                return [{
                    field: "updateTime",
                    sortField: "updateTime",
                    direction: "desc"
                }];
            }
        },
        cssConfig: Object,
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
            page: 1,
            apiRoot: config.api,
            moreParams: {}
        };
    },
    computed: {
        asc () { return this.sortOrder[0].direction === "asc"; }
    },
    render(h) {
        const elems = [
            // h("filter-bar", {
            //     on: {
            //         "filter-set": this.onFilterSet
            //     }
            // }),
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
        return h("div", {name: "MyVuetable"}, elems);
    },
    methods: {
        // render related functions
        renderVuetable(h) {
            const actionsField = {
                name: "__slot:actions",
                title: "操作",
                titleClass: "center aligned",
                dataClass: "collapsing center aligned"
            };
            return h("vuetable", {
                ref: "vuetable",
                props: {
                    css: {...CssConfig, ...this.cssConfig},
                    apiUrl: `${this.apiRoot}/${this.api}`,
                    queryParams: (sortOrder, currentPage, perPage) => ({
                        asc: sortOrder[0].direction === "asc",
                        orderBy: `${this.paramPrefix}${Vue.utils.toSnakeCase(sortOrder[0].field)}`,
                        page: this.page,
                        rows: this.perPage
                    }),
                    perPage: this.perPage,
                    dataPath: "data.rows",
                    paginationPath: "data",
                    multiSort: true,
                    sortOrder: this.sortOrder,
                    appendParams: { ...this.moreParams },
                    rowClass: this.rowClass,
                    noDataTemplate: "没有数据",
                    detailRowComponent: this.detailRowComponent,
                    ...this.$options.propsData,
                    fields: this.showActions
                        ? [...this.fields, actionsField]
                        : [...this.fields]
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
                        const { orderBy } = payload.config.params;
                        this.orderBy = orderBy;
                    },
                    // 将所有的监听器port给Vuetable
                    ...this.$listeners
                },
                scopedSlots: {
                    // thats why use render function instead of template
                    ...this.$vnode.data.scopedSlots,
                    actions: ({ rowData, rowIndex }) => {
                        return (
                            <el-button type="text" class="danger" onClick={
                                event => { this.remove(rowData, event); }
                            }> 删除 </el-button>
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
                h("vuetable-pagination-info", {
                    props: {
                        noDataTemplate: "",
                        infoTemplate: "第{from}到{to}条数据, 总共{total}条数据"
                    },
                    ref: "paginationInfo"
                }),
                h("vuetable-pagination", {
                    props: {
                        noDataTemplate: ""
                    },
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
            if (!this.detailModalComponent) return;
            this.id = data.id;
            // 显示详情
            const modal = $(`.detail-modal-${this.api}`).modal({
                detachable: false // 防止切换时，重复detach到外部dimmer里
            });
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
            return this.page;
        },
        reload() {
            this.$refs.vuetable.reload();
        },
        async edit(data, event) {
            event.stopPropagation();
            this.$emit("edit", data.id);
        },
        async remove(data, event) {
            event.stopPropagation();
            await this.$confirm("确认删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            });
            const slashIndex = this.api.lastIndexOf("/");
            // eg. community/13/building => building
            const api = slashIndex === -1
                ? this.api
                : this.api.substr(slashIndex + 1);
            await this.$request({
                url: `${api}/${data.id}`,
                method: "delete"
            }).then(() => {
                this.$message({
                    type: "success",
                    message: "删除成功"
                });
                this.$refs.vuetable.reload();
            }).catch(({message}) => {
                this.$message({
                    type: "warning",
                    message
                });
            });
        },
        formatDate(value, fmt = "D MMM YYYY") {
            return value == null ? "" : moment(value, "YYYY-MM-DD").format(fmt);
        },
        onFilterSet(filterText) {
            this.moreParams = { name: filterText };
            this.$refs.vuetable.$nextTick(
                () => {
                    console.log(this.$refs.vuetable.appendParams);
                    this.$refs.vuetable.refresh();
                }
            );
        },
        onFilterReset() {
            delete this.moreParams.name;
            this.$nextTick(() => this.$refs.vuetable.refresh());
        },
        transform(data) {
            console.log(data);
            if (this.formatter) data = this.formatter(data);
            return this.paginationFormatter(data);
        },
        paginationFormatter(data) {
            const total = data.data.total;
            const lastPage = Math.ceil(total / this.perPage);
            const from = (this.page - 1) * this.perPage + 1;
            const to = total < this.perPage ? total : from + this.perPage - 1;
            const queryUrl = `${this.apiRoot}${this.api}?orderBy=${this.orderBy}&asc=${this.asc}&rows=${this.perPage}`;
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
