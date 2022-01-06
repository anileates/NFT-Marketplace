<template lang="pug">
a.search-result-item.flex-row.flex-ai-c(:href="getRedirectUrl")
  .avatar-wrapper
    app-avatar(:imgUrl="getGivenItem.imageUrl" :isEditable="false")
  p {{ getGivenItem.title }}
  span.itemType - {{ getGivenItem.itemType }}
</template>

<script>
import Avatar from "./Avatar";

export default {
  name: "SearchResultItem",
  props: {
    userItem: {
      imageUrl: {
        type: String,
        required: true
      },
      title: { // title also stands for username here
        type: String,
        required: true
      },
    },
    collectionItem: {
      imageUrl: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      contractAddress: {
        type: String,
        required: true
      }
    },
    assetItem: {
      imageUrl: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      contractAddress: {
        type: String,
        required: true
      },
      tokenId: {
        type: String,
        required: true
      }
    }
  },
  components: {
    appAvatar: Avatar
  },
  data() {
    return {}
  },
  computed: {
    getGivenItem() {
      if (this.assetItem) {
        return {
          imageUrl: this.assetItem.imageUrl,
          title: this.assetItem.title,
          itemType: 'asset'
        }
      } else if (this.userItem) {
        return {
          imageUrl: this.userItem.imageUrl,
          title: this.userItem.title,
          itemType: 'profile'
        }
      } else if (this.collectionItem) {
        return {
          imageUrl: this.collectionItem.imageUrl,
          title: this.collectionItem.title,
          itemType: 'collection'
        }
      }

    },
    getRedirectUrl() {
      if (this.userItem) {
        return `/users/${this.userItem.title}`
      } else if (this.assetItem) {
        return `/tokens/${this.assetItem.contractAddress}/${this.assetItem.tokenId}`
      } else if (this.collectionItem) {
        return `/collections/${this.collectionItem.contractAddress}`
      }
    }
  }
}
</script>

<style lang="scss">
a {
  text-decoration: none;
  /* Make text not selectable */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.search-result-item {
  width: 100%;
  height: 100%;
  padding: 0 1rem;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  //width:300px; // some width
  color: black;

  cursor: pointer;

  &:hover {
    box-shadow: 2px 2px 30px 0 rgba(197, 197, 197, .9)
  }

  .avatar-wrapper {
    width: 2rem;
    height: 2rem;

    background-color: black;

    border-radius: 50%;
    margin-right: 1rem;
  }
}


.itemType {
  font-size: 0.8rem;
  margin-left: 0.5rem;
  margin-top: 0.1rem;

  letter-spacing: 0.03rem;
  color: gray
}
</style>