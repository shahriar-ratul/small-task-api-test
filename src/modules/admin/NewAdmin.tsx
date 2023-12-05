import CreateAdminForm from "@/components/forms/admin/CreateAdminForm";
import AppRowContainer from "@/lib/AppRowContainer";
import { Breadcrumb, Card } from "antd";
import Link from "next/link";

import React from "react";

const NewAdmin = () => {
  return (
    <>
      <AppRowContainer>
        <Breadcrumb
          style={{
            margin: "10px 30px",
            textAlign: "left"
          }}
          items={[
            {
              title: <Link href="/admin">Home</Link>
            },
            {
              title: <Link href="/admin/settings">Settings Dashboard</Link>
            },
            {
              title: (
                <Link href="/admin/settings/user-management/admin">Admins</Link>
              )
            },
            {
              title: "New Admin"
            }
          ]}
        />

        <Card
          title="New Admin"
          style={{
            width: "80%",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            margin: "0 auto",
            textAlign: "center"
          }}
        >
          <CreateAdminForm />
        </Card>
      </AppRowContainer>
    </>
  );
};

export default NewAdmin;
