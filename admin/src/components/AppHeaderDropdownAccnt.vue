<script setup>
import avatar from '@/assets/images/avatars/3.jpg'
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  fetch('http://localhost:3000/user/logout', {
  method: 'POST',
  credentials: 'include'  // Cực kỳ quan trọng: gửi cookie cùng request
})
.then(response => response.json())
.then(data => console.log(data.message))
.catch(error => console.error('Lỗi khi đăng xuất:', error));
router.push("/login");
}

const itemsCount = 42
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-bell" /> Thông báo
        <CBadge color="info" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> Tin nhắn
        <CBadge color="success" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-task" /> Công việc
        <CBadge color="danger" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-comment-square" /> Comments
        <CBadge color="warning" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold my-2"
      >
        Cài đặt
      </CDropdownHeader>
      <CDropdownItem> <CIcon icon="cil-user" /> Hồ sơ </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-settings" /> Cài đặt </CDropdownItem>
      <!-- <CDropdownItem>
        <CIcon icon="cil-dollar" /> Payments
        <CBadge color="secondary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-file" /> Projects
        <CBadge color="primary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <CDropdownDivider />
      <CDropdownItem> <CIcon icon="cil-shield-alt" /> Khóa tài khoản </CDropdownItem>
      <CDropdownItem @click="logout">
        <CIcon icon="cil-lock-locked" /> Đăng xuất
      </CDropdownItem>    </CDropdownMenu>
  </CDropdown>
</template>
