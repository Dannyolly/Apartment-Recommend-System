import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/user",
    meta: {
      title: "帐号管理",
      elIcon: "Grid"
    },
    children: [
      {
        path: "user",
        component: () => import("@/views/dashboard/user/index.vue"),
        name: "Dashboard",
        meta: {
          title: "用户管理",
          svgIcon: "dashboard",
          affix: true
        }
      },
      {
        path: "admin",
        component: () => import("@/views/dashboard/admin/index.vue"),
        name: "ElementPlus",
        meta: {
          title: "管理员管理",
          svgIcon: "dashboard",
        }
      }
    ]
  },
  {
    path: "/rent",
    component: Layout,
    redirect: "/rentOrder",
    name: "Rent",
    meta: {
      title: "租赁管理",
      svgIcon: "menu"
    },
    children: [
      {
        path: "rentOrder",
        component: () => import("@/views/rent/rentOrder/index.vue"),
        name: "RentOrder",
        meta: {
          title: "公寓订单"
        }
      },
      {
        path: "appointment",
        component: () => import("@/views/rent/appointment/index.vue"),
        name: "Appointment",
        meta: {
          title: "公寓预约订单"
        }
      },
      {
        path: "room",
        component: () => import("@/views/rent/room/index.vue"),
        name: "Room",
        meta: {
          title: "公寓管理"
        }
      },
    ]
  },
  {
    path: "/property",
    component: Layout,
    redirect: "/service",
    name: "Property",
    meta: {
      title: "物业管理",
      svgIcon: "menu"
    },
    children: [
      {
        path: "service",
        component: () => import("@/views/Property/Service.vue"),
        name: "Service",
        meta: {
          title: "服务管理"
        }
      },
      {
        path: "serviceOrder",
        component: () => import("@/views/Property/ServiceOrder.vue"),
        name: "ServiceOrder",
        meta: {
          title: "服务订单管理"
        }
      }
    ]
  },
  {
    path: "/info",
    component: Layout,
    redirect: "/info/post",
    name: "Post",
    meta: {
      title: "信息交流管理",
      svgIcon: "menu"
    },
    children: [
      {
        path: "post",
        component: () => import("@/views/post/index.vue"),
        name: "Post",
        meta: {
          title: "帖子管理",
          svgIcon: "menu"
        }
      },
    ]
  },
  {
    path: "/lease",
    component: Layout,
    redirect: "/lease/leaseOrder",
    name: "Lease",
    meta: {
      title: "出租管理",
      svgIcon: "menu"
    },
    children: [
      {
        path: "leaseOrder",
        component: () => import("@/views/lease/index.vue"),
        name: "LeaseOrder",
        meta: {
          title: "出租订单管理",
          svgIcon: "menu"
          //svgIcon: "menu"
        }
      }
    ]
  },
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面权限",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
