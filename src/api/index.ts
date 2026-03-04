    import request from '../utils/request';

    const API = {
        // fetchData: (params: any) => request.get("./table.json", params),
        getUserInfo: (data: any) => request.get(`/user/list?page=${data.page}&searchParam=${data.searchParam}`),//获取用户列表
        Login: (params: any) => request.post("/admin/doLogin", params), //登录接口
        getUserbusiness: (data: any) => request.get(`/user/businessUserList?page=${data.page}&searchParam=${data.searchParam}`), //获取企业列表
        getBannerList: (data: any) => request.get(`/operation/banner/list?status=${data.status}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}&location=${data.location}`), //banber列表
        getShowcase: (data: any) => request.get(`/operation/showcase/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}&status=${data.status}`),//橱窗列表
        getLaunchList: (data: any) => request.get(`/operation/launch/list?userId=${data.id}&status=${data.status}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}&type=${data.type}&adType=${data.adType}&showcaseId=${data.showcaseId}`), //商品投放列表
        getCheckList: (data: any) => request.get(`/dynamic/check/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}&account=${data.account}&publishStartTime=${data.publishStartTime}&publishEndTime=${data.publishEndTime}&status=${data.status}`), //审核列表
        getRemarkList: (data: any) => request.get(`/dynamic/remark/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`),//评论列表
        getVenueList: (data: any) => request.get(`/spreadtrumVenue/loadListPage?pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}&venueType=${data.venueType}&status=${data.status}`),//场馆列表
        getVenueTypeList: (data: any) => request.get(`/spreadtrumVenueType/loadListPage?pageNum=${data.pageNum}&venueId=${data.venueId}&type=${data.type}&name=${data.name}&pageSize=${data.pageSize ? data.pageSize : 10}`), //场馆类型列表
        getvideos: (data: any) => request.get(`/video/loadListPage?pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}`),// 视频列表
        searchUserVipInfo: (data: any) => request.get(`/user/detail?userId=${data.id}`),//获取用户会员信息
        searchUserAmount: (data: any) => request.get(`/vip/user/${data.id}/pay/count`), //查询用户累计消费(含推广和会员)
        getUserTextInfo: (data: any) => request.get(`/user/trendsByUserId?userId=${data.id}&page=${data.page}`),// 根据用户ID查询用户动态
        getUserBookInfo: (data: any) => request.get(`/user/visitorByUserId?userId=${data.id}&page=${data.page}`),//根据用户ID查询用户预约记录
        getUserBuyInfo: (data: any) => request.get(`/user/meal/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&userId=${data.id}`),//根据用户ID查询用户购买记录
        searchUserInfo: (data: any) => request.get(`/user/selectById?id=${data}`),// 查询用户
        updateUserStatus: (data: any) => request.get(`/user/updateUserStatus?status=${data.status}&id=${data.id}`), // 更改用户状态
        postBannerInfo: (data: any) => request.post(`/operation/banner/${data.id}/status`,{status:data.status}), //banner列表上下架
        delBannerInfo: (data: any) => request.delete(`/operation/banner/${data.id}`), //banner列表删除
        getBannerInfo: (data: any) => request.get(`/operation/banner/${data.id}`),//获取banner信息
        postBannerList: (data: any) => request.post(`/operation/banner`, data),//新增banner
        postShowCaseInfo: (data: any) => request.post(`/operation/showcase`, data), //新增橱窗
        delShowCaseInfo: (data: any) => request.delete(`/operation/showcase/${data.id}`), //删除橱窗
        getShowCaseInfo: (data: any) => request.get(`/operation/showcase/${data.id}`),//获取橱窗详情
        postLaunchInfoUpDown: (data: any) => request.post(`/operation/launch/${data.id}/status`, data),//商品投放上下架
        delLaunchInfo: (data: any) => request.delete(`/operation/launch/${data.id}`), //删除商品投放列表
        getShowcaseList: (data: any) => request.get(`/operation/showcase/available/list`),//获取正常状态橱窗列表 == 可推广位置列表
        postLaunchInfo: (data: any) => request.post(`/operation/launch`, data),//新增修改商品投放
        getmealList: (data: any) => request.get(`/merchant/promotion/meal/list`),////获取推广模式下 推广位置以及套餐
        getTrumInfo: (data: any) => request.get(`/spreadtrumInformation/loadListPage?pageNum=${data.pageNum ? data.pageNum :''}&venueId=${data.venueId ? data.venueId :''}&name=${data.name ? data.name : ''}`, data),//获取场馆展览信息
        getTrumBookInfo: (data: any) => request.get(`/spreadtrumBook/loadListPage`, data),//获取场馆书籍信息
        getTrumGoodsInfo: (data: any) => request.get(`/spreadtrumGoods/loadListPage`, data),//获取场馆文创商品信息
        getTgtSaleList: (data: any) => request.get(`/operation/promotion/meal/list`),//获取推广通销售套餐列表
        getTgtSaleInfo: (data: any) => request.get(`/operation/launch/${data.id}`),//获取推广通销售套餐详情
        getVenueInfo: (data: any) => request.get(`/spreadtrumVenue/selectById?id=${data.id}`), //场馆详情
        getTabs: (data: any) => request.get(`/spreadtrumVenueType/loadListPage?pageNum=${data.pageNum}&venueId=${data.venueId}&type=${data.type}&name=${data.name ? data.name : ''}&pageSize=${data.pageSize ? data.pageSize : 10}`),//获取场馆标签的种类
        postTabs: (data: any) => request.post(`/spreadtrumVenueType/doInsert`, data), //新增场馆标签种类
        delTabs:(data: any) => request.post(`/spreadtrumVenueType/doDelete?id=${data.id}`), //新增场馆标签种类
        getTrumlist: (data: any) => request.get(`/spreadtrumInformation/loadListPage?pageNum=${data.pageNum}&venueId=${data.id}`), // 获取场馆下展览列表
        postTrumInfo: (data: any) => request.post(`/spreadtrumInformation/doInsert`, data), //新增展览
        UpDateTrumInfo: (data: any) => request.get(`/spreadtrumInformation/doUpdateStatus?status=${data.status}&id=${data.id}`), //更新展览详情状态
        ChangeTrumInfo: (data: any) => request.post(`/spreadtrumInformation/doUpdate`, data),//更新场馆下展览信息
        delTrumInfo: (data: any) => request.post(`/spreadtrumInformation/doDelete?&id=${data.id}`), //删除展览列表
        getTrumDigList: (data: any) => request.post(`/spreadtrumDigital/loadListPage?venueId=${data.id}&pageNum=${data.pageNum}&name=${data.name}`),//数字展
        postTrumDigInfo: (data: any) => request.post(`/spreadtrumDigital/doInsert`, data),//新增数字展
        delTrumDigInfo: (data: any) => request.post(`/spreadtrumDigital/doDelete?id=${data.id}`),//删除数字展
        UpDateTrumDigInfo: (data: any) => request.post(`/spreadtrumDigital/doUpdate`, data),//更新数字展
        ChangeTrumDigInfo: (data: any) => request.get(`/spreadtrumDigital/doUpdateStatus?status=${data.status}&id=${data.id}`),//更新数字展状态
        getTrumGoodslist: (data: any) => request.get(`/spreadtrumGoods/loadListPage?pageNum=${data.pageNum}&venueId=${data.id}`),///获取场馆下文创商品列表
        postTrumGoodsInfo: (data: any) => request.post(`/spreadtrumGoods/doInsert`, data),//新增文创商品
        UpdateTrumGoodsInfo: (data: any) => request.post(`/spreadtrumGoods/doUpdate`, data), //更新场馆下文创商品详情
        ChangeTrumGoodsInfo: (data: any) => request.get(`/spreadtrumGoods/doUpdateStatus?status=${data.status}&id=${data.id}`),//更新文创商品状态
        delTrumGoodsInfo: (data: any) => request.get(`/spreadtrumGoods/doDelete?id=${data.id}`),//删除场馆下文创商品详情
        getTrumBooklist: (data: any) => request.post(`/spreadtrumBook/loadListPage?venueId=${data.id}&pageNum=${data.pageNum}`), //获取场馆下相关书籍
        postTrumBookInfo: (data: any) => request.post(`/spreadtrumBook/doInsert`, data),//新增场馆下书籍详情
        UpdateTrumBookInfo: (data: any) => request.post(`/spreadtrumBook/doUpdate`, data),//更新场馆下书籍详情
        ChangeTrumBookInfo: (data: any) => request.get(`/spreadtrumBook/doUpdateStatus?status=${data.status}&id=${data.id}`),//更新书籍相关状态
        delTrumBookInfo: (data: any) => request.get(`/spreadtrumBook/doDelete?id=${data.id}`),//删除场馆下书籍详情
        postVenueType: (data: any) => request.post(`/spreadtrumVenueType/doInsert`, data), //新增场馆类型
        UpDateVenueType: (data: any) => request.post(`/spreadtrumVenueType/doUpdate`, data),//编辑场馆类型
        delVenueType: (data: any) => request.get(`/spreadtrumVenueType/doDelete?id=${data.id}`), //删除场馆类型
        UpdateVenueInfo: (data: any) => request.post(`/spreadtrumVenue/doUpdate`, data), //更新场馆的基本信息

        getSupplyList: (params: any) => request.get(`/spreadtrumSupply/loadListPage?pageNum=${params.pageNum}&name=${params.name}&type=0`),
        // getTabs:(params:any)=> request.get(`/spreadtrumVenueType/loadListPage?pageNum=${params.pageNum}&venueId=${params.venueId}&type=${params.type}`),
        postSupplyInfo: (params: any) => request.post("/spreadtrumSupply/doInsert", params),
        getSupplyInfo: (params: any) => request.get(`/spreadtrumSupply/selectById?id=${params.id}`),
        postUpDateSupplyInfo: (params: any) => request.post("/spreadtrumSupply/doUpdate", params),
        // postTabs : (params:any) => request.post(`/spreadtrumVenueType/doInsert`,params),
        delSupplyInfo: (params: any) => request.get(`/spreadtrumSupply/doDelete?id=${params.id}`),
        getExchangeList: (params: any) => request.get(`/spreadtrumExchange/loadListPage?pageNum=${params.pageNum}&name=${params.name}`),
        postExchangeInfo: (params: any) => request.post("/spreadtrumExchange/doInsert", params),
        getExchangeInfo: (params: any) => request.get(`/spreadtrumExchange/selectById?id=${params.id}`),
        //删除展览详情
        delExchangeInfo : (params: any) => request.get(`/spreadtrumExchange/doDelete?id=${params.id}`),
        postUpDateExchangeInfo: (params: any) => request.post("/spreadtrumExchange/doUpdate", params),
        getvipDdList: (params: any) => request.get(`/order/vip-list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&orderSerial=${params.id}`),
        getTgDdList: (params: any) => request.get(`/order/promotion-list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&orderSerial=${params.id}&promotionType=${params.type}`),
        getTgtPackList: (params: any) => request.get(`/merchant/promotion/meal/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&name=${params.name}`),
        postTgtInfo: (params: any) => request.post(`/merchant/promotion/meal`, params),
        // getShowcaseList : (params:any) => request.get(`/operation/showcase/available/list`),
        postTgtInfoCN: (params: any) => request.post(`/merchant/promotion/meal/${params.id}`, params),
        delTgtInfoCN: (params: any) => request.delete(`/merchant/promotion/meal/${params.id}`),
        getBusinessList: (params: any) => request.get(`/merchant/business/list`),
        postMemberPackInfo: (params: any) => request.post(`/vip/meal`, params),
        getMemberPackInfo: (params: any) => request.get(`/vip/meal/${params.id}`),
        delMemberPackInfo: (params: any) => request.delete(`/vip/meal/${params.id}`),
        postBusinessTitle: (params: any) => request.post(`/merchant/business`, params),
        DelBusinessTitle: (params: any) => request.delete(`/merchant/business/${params.businessId}`),
        DelBusinessInfo: (params: any) => request.delete(`/merchant/business/item/${params.id}`),
        getSuggetList: (params: any) => request.get(`/merchant/suggest/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&name=${params.name}`),
        UpDownBusinessInfo: (params: any) => request.post(`/merchant/business/item/${params.id}/status`, params.status),
        PostSuggetInfo: (params: any) => request.post(`/merchant/suggest`, params),
        PostUpDownSuggetInfo: (params: any) => request.post(`/merchant/suggest/${params.id}/status`, params.status),
        DelUpDownSuggetInfo: (params: any) => request.delete(`/merchant/suggest/${params.id}`),
        getBusinessInfoType: (params: any) => request.get(`/Two/system/listType`),
        postBusinessInfo: (params: any) => request.post(`/merchant/business/item`, params),
        getMemberPack: (params: any) => request.get(`/vip/meal/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&name=${params.name}`),
        getTgtInfo: (params: any) => request.get(`/merchant/promotion/meal/${params.promotionMealId}/detail/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}&venueName=${params.venueName}&name=${params.name}&showcaseId=${params.showcaseId}&phone=${params.phone}&payStartTime=${params.payStartTime}&payEndTime=${params.payEndTime}`),
        getContentInfo : (params:any) =>request.get(`/dynamic/content/${params.contentId}`),
        updateContentStatus : (params:any) => request.post(`/dynamic/content/${params.contentId}/status`,params.status),
        delContentInfo: (params:any) => request.delete(`/dynamic/content/${params.contentId}`),
        getremarkInfo :(params:any) => request.get(`/dynamic/remark/${params.remarkId}`),
        updateRemarkStatus : (params:any) => request.post(`/dynamic/remarkId/${params.remarkId}/status`,params.status),
        delRemarkInfo: (params:any) => request.delete(`/dynamic/remark/${params.remarkId}`),
        updateNewVenue:(params:any) => request.get(`/spreadtrumVenue/doUpdateStatus?status=${params.status}&id=${params.id}`),
        getContentList: (data:any) =>request.get(`/dynamic/content/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&name=${data.name}&account=${data.account}&publishStartTime=${data.publishStartTime}&publishEndTime=${data.publishEndTime}&status=${data.status}`),
        PostContentInfo:(params:any) => request.post(`/dynamic/content`,params),
        getContentRemarkList:(params:any) => request.get(`/dynamic/content/${params.contentId}/remark/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}`),  
        getRemarkReplys :(params:any) => request.get(`/dynamic/content/${params.contentId}/remark/${params.remarkId}/list?pageNum=${params.pageNum}&pageSize=${params.pageSize}`),
        delRemark:(params:any) => request.delete(`/dynamic/remark/${params.remarkId}`),
        getMusicList:(params:any) => request.get(`/spreadtrumAudio/loadListPage?pageNum=${params.pageNum}&pageSize=${params.pageSize}&status=${params.status}&name=${params.name}&numOrder=${params.numOrder}`),
        postMusicList:(params:any) => request.post(`/spreadtrumAudio/doInsert`,params),
        getMusicInfo:(params:any) => request.get(`/spreadtrumAudio/selectById?id=${params.id}`),
        postMusicInfo:(params:any) => request.post(`/spreadtrumAudio/doUpdate`,params),
        postMusicInfoItem:(params:any) => request.post(`/spreadtrumAudio/doInsertAudio`,params),
        delpostMusicInfoItem:(params:any) => request.get(`/spreadtrumAudio/doDeleteAudio?id=${params.id}`),
        updateMusicInfoItem:(params:any) => request.post(`/spreadtrumAudio/doUpdateAudio`,params),
        updateMusicInfo:(params:any) => request.get(`/spreadtrumAudio/doUpdateStatus?id=${params.id}&status=${params.status}`),
        delMusicInfo:(params:any) => request.delete(`/spreadtrumAudio/doDelete?id=${params.id}`),
        postMusicLabel:(params:any) => request.post(`/spreadtrumAudio/doInsertLabel`,params),
        getMusicLabelList:() => request.get(`/spreadtrumAudio/audioLabelList`),
        delMusicLabel:(params:any) => request.get(`/spreadtrumAudio/doDeleteLabel?id=${params.id}`),
        updateVenueTop:(params:any) => request.get(`/spreadtrumVenue/doUpdateTop?id=${params.id}&status=${params.status}`),

        // 文物列表
        getAntiqueList: (data: any) => request.get(`/spreadtrumAntique/loadListPage?pageNum=${data.pageNum}&venueId=${data.venueId}&status=${data.status}&type=${data.type}&name=${data.name}&pageSize=${data.pageSize ? data.pageSize : 10}`), //场馆类型列表
        delAntique: (data: any) => request.get(`/spreadtrumAntique/doDelete?id=${data.id}`), //删除场馆类型
        updateAntique: (data: any) => request.get(`/spreadtrumAntique/doUpdateStatus?status=${data.status}&id=${data.id}`), //更新展览详情状态
        postAntique: (params: any) => request.post("/spreadtrumAntique/doInsert", params),
        getAntique: (id: string) => request.get(`/spreadtrumAntique/selectById?id=${id}`),
        postUpDateAntique: (params: any) => request.post("/spreadtrumAntique/doUpdate", params),
        saveAntiqueFile: (params: any) => request.post("/file/saveFile.htm", params),

        // PASS卡
        getPassCardList: (data: any) => request.get(`/passcard/list?pageNum=${data.pageNum}&name=${data.name}&enterpriseId=${data.enterpriseId}&pageSize=${data.pageSize ? data.pageSize : 10}`), 
        delPasscard: (data: any) => request.get(`/passcard/delete?id=${data.id}`), //删除
        getPasscardDel:(data: any) => request.get(`/passcard/selectById?id=${data.id}`), //详情
        insertPasscard:(data: any) => request.post(`/passcard/insert`,data), //新增
        updatePasscard:(data: any) => request.post(`/passcard/update`,data), //更新
        getCreatorAll:() => request.get(`/passcard/creator/listAll`), //获取所有用户
        getPassActivityList:(data: any) => request.get(`/passcard/promotion/list?pageNum=${data.pageNum}&pageSize=${data.pageSize ? data.pageSize : 10}&name=${data.name}&promotionDate=${data.promotionDate}&enterpriseId=${data.enterpriseId}`), //优惠活动列表
        insertPassActivity:(data: any) => request.post(`/passcard/promotion/insert`, data), //新增优惠活动
        updatePassActivity:(data: any) => request.post(`/passcard/promotion/update`, data), //修改优惠活动
        deletePassActivity:(data: any) => request.get(`/passcard/promotion/delete?id=${data.id}`), //删除优惠活动
        getPassActivityDetail:(data: any) => request.get(`/passcard/promotion/selectById?id=${data.id}`), //优惠活动详情
        getPromotionCreatorList:(data: any) => request.get(`/passcard/promotion/creator/listAll?name=${data?.name || ''}`), //优惠活动场馆下拉
        getPromotionCardList:(data: any) => request.get(`/passcard/promotion/card/listAll?enterpriseId=${data?.enterpriseId || 0}`), //优惠活动场馆下的卡片

        // 创作者
        getCreatorList:(data: any) => request.get(`/passcard/creator/list?pageNum=${data.pageNum}&enterpriseId=${data.enterpriseId}&pageSize=${data.pageSize ? data.pageSize : 10}`), //获取所有用户
        delCreator:(data: any) => request.get(`/passcard/creator/delete?id=${data.id}`), //删除
        getCreatorDel:(data: any) => request.get(`/passcard/creator/selectById?id=${data.id}`), //详情
        insertCreator:(data: any) => request.post(`/passcard/creator/insert`,data), //新增
        updateCreator:(data: any) => request.post(`/passcard/creator/update`,data), //更新

    }

    export default API