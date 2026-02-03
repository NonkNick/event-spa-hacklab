Benodigde componenten:



views: - HomeView

&nbsp;      - SpeakersView

&nbsp;      - ProgramView

&nbsp;      - TicketsView

&nbsp;     ( - CheckoutView

&nbsp;      - SuccesView)



layout + UI elementen: - AppHeader

&nbsp;                      - AppFooter

&nbsp;                      - NavigationBar

&nbsp;                      - PageContainer

SpeakersView -->

/components/speakers: - SpeakersList.vue

&nbsp;                        |

&nbsp;                        |\_ Speakerscard.vue



&nbsp;                     - AdminSpeakerModal.vue (CRUD)

&nbsp;                     - PresentationList.vue



ProgramView -->

/components/program: - ProgramTimeline.vue

&nbsp;                      |  

&nbsp;                      |\_ ProgramItemCard.vue



&nbsp;                    - AdminProgramModal.vue (CRUD)



TicketsView

/components/tickets: - TicketList.vue

&nbsp;                      |

&nbsp;                      |\_TicketCard.vue



&nbsp;                    - CartSummary.vue

&nbsp;                    - CheckOut.vue



/components/ui: - BaseButton.vue

&nbsp;               - BaseInput.vue

&nbsp;               - BaeModal.vue



&nbsp;               

















