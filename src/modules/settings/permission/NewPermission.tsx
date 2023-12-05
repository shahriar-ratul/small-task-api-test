import CreatePermissionForm from "@/components/forms/permission/CreatePermissionForm";
import AppRowContainer from "@/lib/AppRowContainer";
import { Breadcrumb, Card } from "antd";
import Link from "next/link";

import React from "react";

const NewPermission = () => {
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
              title: <Link href="/admin/settings">Settings</Link>
            },
            {
              title: (
                <Link href="/admin/settings/user-management/permission">
                  Permissions
                </Link>
              )
            },
            {
              title: "New Permission"
            }
          ]}
        />

        <Card
          title="New Permission"
          style={{
            width: "90%",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            margin: "0 auto",
            textAlign: "center"
          }}
        >
          <CreatePermissionForm />
        </Card>
      </AppRowContainer>
    </>
  );
};

export default NewPermission;
